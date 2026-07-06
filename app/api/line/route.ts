// app/api/line/route.ts
// LINE Webhook: รับเคลม, คืนสินค้า, รีวิว + ส่ง Daily Summary
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push';

function isConfigured() {
  return Boolean(supabase && LINE_CHANNEL_ACCESS_TOKEN);
}

function missingConfigResponse(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

// ─── Helpers ────────────────────────────────────────────────
async function replyLine(replyToken: string, text: string) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error('Missing LINE channel access token');
  }

  await fetch(LINE_REPLY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}` },
    body: JSON.stringify({ replyToken, messages: [{ type: 'text', text }] }),
  });
}

async function pushLine(userId: string, text: string) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error('Missing LINE channel access token');
  }

  await fetch(LINE_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}` },
    body: JSON.stringify({ to: userId, messages: [{ type: 'text', text }] }),
  });
}

// ─── Webhook Handler ─────────────────────────────────────────
export async function POST(req: Request) {
  if (!isConfigured()) {
    return missingConfigResponse('Missing Supabase or LINE configuration');
  }

  try {
    const body   = await req.json();
    const events = body.events ?? [];

    for (const event of events) {
      if (event.type !== 'message' || event.message.type !== 'text') continue;

      const msg    = event.message.text.trim();
      const userId = event.source.userId;
      const token  = event.replyToken;

      // ── เคลมสินค้า: พิมพ์ "เคลม [สินค้า] [เหตุผล]" ──
      if (msg.startsWith('เคลม')) {
        const parts       = msg.split(' ');
        const productName = parts[1] || 'ไม่ระบุสินค้า';
        const reason      = parts.slice(2).join(' ') || 'ไม่ระบุเหตุผล';

        await supabase!.from('claims_returns').insert([{
          line_user_id: userId,
          type: 'เคลม',
          product_name: productName,
          reason,
          status: 'pending',
        }]);

        await replyLine(token,
          `✅ รับเรื่องเคลม "${productName}" เรียบร้อยแล้วครับ\n` +
          `📋 เหตุผล: ${reason}\n` +
          `⏰ ทีมงานจะติดต่อกลับภายใน 24 ชม.`
        );
      }

      // ── คืนสินค้า: พิมพ์ "คืน [สินค้า] [เหตุผล]" ──
      else if (msg.startsWith('คืน')) {
        const parts       = msg.split(' ');
        const productName = parts[1] || 'ไม่ระบุสินค้า';
        const reason      = parts.slice(2).join(' ') || 'ไม่ระบุเหตุผล';

        await supabase!.from('claims_returns').insert([{
          line_user_id: userId,
          type: 'คืนสินค้า',
          product_name: productName,
          reason,
          status: 'pending',
        }]);

        await replyLine(token,
          `✅ รับเรื่องคืนสินค้า "${productName}" เรียบร้อยแล้วครับ\n` +
          `📋 เหตุผล: ${reason}\n` +
          `⏰ ทีมงานจะติดต่อกลับภายใน 24 ชม.`
        );
      }

      // ── รีวิวสินค้า: พิมพ์ "รีวิว [สินค้า] [1-5] [ข้อความ]" ──
      else if (msg.startsWith('รีวิว')) {
        const parts       = msg.split(' ');
        const productName = parts[1] || 'ไม่ระบุสินค้า';
        const rating      = Math.min(5, Math.max(1, parseInt(parts[2]) || 5));
        const comment     = parts.slice(3).join(' ') || 'ไม่มีข้อความเพิ่มเติม';

        await supabase!.from('product_reviews').insert([{
          customer_name: `ลูกค้า LINE (${userId.substring(0, 6)})`,
          product_name: productName,
          rating,
          comment,
        }]);

        await replyLine(token,
          `🙏 ขอบคุณสำหรับรีวิว ${'⭐'.repeat(rating)} (${rating}/5)\n` +
          `สินค้า: ${productName}\n` +
          `ความคิดเห็นของท่านช่วยให้เราพัฒนาบริการได้ดีขึ้นมากครับ`
        );
      }

      // ── เมนู / Help ──
      else if (msg === 'เมนู' || msg === 'help' || msg === 'ช่วยเหลือ') {
        await replyLine(token,
          `📋 คำสั่งที่ใช้ได้ครับ\n\n` +
          `🔧 เคลม [สินค้า] [เหตุผล]\n` +
          `↳ เช่น: เคลม กระเบื้องขาว แตกร้าว\n\n` +
          `📦 คืน [สินค้า] [เหตุผล]\n` +
          `↳ เช่น: คืน Lunar Oasis สีผิดจากที่สั่ง\n\n` +
          `⭐ รีวิว [สินค้า] [1-5] [ข้อความ]\n` +
          `↳ เช่น: รีวิว SuperWhite 5 สวยมากปูง่าย\n\n` +
          `พิมพ์ "เมนู" เพื่อดูคำสั่งอีกครั้งครับ 😊`
        );
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ─── Daily Summary (เรียกจาก Cron) ──────────────────────────
// GET /api/line?action=daily-summary&secret=YOUR_CRON_SECRET
export async function GET(req: Request) {
  if (!isConfigured()) {
    return missingConfigResponse('Missing Supabase or LINE configuration');
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const secret = searchParams.get('secret');

  // ป้องกัน unauthorized
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (action === 'daily-summary') {
    // ดึงเคสของวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayClaims } = await supabase!
      .from('claims_returns')
      .select('*')
      .gte('created_at', today.toISOString());

    const { data: criticalStock } = await supabase!
      .from('tiles_stock')
      .select('name, quantity')
      .lte('quantity', 15);

    const pending  = (todayClaims ?? []).filter(c => c.status === 'pending').length;
    const total    = (todayClaims ?? []).length;
    const critical = criticalStock ?? [];

    const stockAlert = critical.length > 0
      ? `\n\n⚠️ สต็อกใกล้หมด (${critical.length} รายการ)\n` +
        critical.map(t => `• ${t.name}: ${t.quantity} กล่อง`).join('\n')
      : '\n\n✅ สต็อกปกติทุกรายการ';

    const summary =
      `📊 สรุปประจำวัน — ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}\n\n` +
      `📥 เคส/คืนสินค้าวันนี้: ${total} เคส\n` +
      `⏳ รอพนักงานตรวจสอบ: ${pending} เคส` +
      stockAlert +
      `\n\n🔗 เปิดระบบ: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}`;

    // ส่งหา Line User ID ของพนักงาน (ตั้งใน env)
    const staffUserId = process.env.LINE_STAFF_USER_ID;
    if (staffUserId) {
      await pushLine(staffUserId, summary);
    }

    return NextResponse.json({ sent: true, pending, total });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}