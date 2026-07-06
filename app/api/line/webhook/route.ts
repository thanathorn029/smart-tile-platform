import { supabase } from '@/app/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// LINE Webhook signature verification
function verifySignature(
  body: string,
  signature: string,
  channelSecret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// POST — รับข้อมูลจาก LINE Webhook
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-line-signature') || '';
    const body = await request.text();

    // ตรวจสอบลายเซนต์ (หากมี Channel Secret)
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    if (channelSecret && !verifySignature(body, signature, channelSecret)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    // ประมวลผลแต่ละเหตุการณ์
    for (const event of data.events || []) {
      await handleEvent(event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handleEvent(event: any) {
  const { type, replyToken, message, source } = event;

  if (type === 'message' && message?.type === 'text') {
    await handleTextMessage(message.text, source?.userId || '');
  }

  if (type === 'postback') {
    await handlePostback(event.postback?.data, source?.userId || '');
  }
}

async function handleTextMessage(text: string, userId: string) {
  const lowerText = text.toLowerCase();

  // ตรวจหาคำสำคัญ
  if (lowerText.includes('เคลม') || lowerText.includes('ขอเคลม')) {
    // สร้างเคลมใหม่
    await supabase.from('claims_returns').insert([{
      line_user_id: userId,
      type: 'เคลม',
      reason: text,
      status: 'pending',
    }]);
  } else if (lowerText.includes('คืน') || lowerText.includes('ขอคืน')) {
    // สร้างการคืนสินค้า
    await supabase.from('claims_returns').insert([{
      line_user_id: userId,
      type: 'คืนสินค้า',
      reason: text,
      status: 'pending',
    }]);
  } else if (lowerText.includes('รีวิว') || lowerText.includes('ความเห็น')) {
    // ปล่อยให้ LINE flow ของรีวิวจัดการต่อ
    // ส่วนนี้ขึ้นอยู่กับการออกแบบ Rich Menu
  }
}

async function handlePostback(data: string, userId: string) {
  // จัดการ Postback จาก Rich Menu
  // เช่น: action=review&product=lunar_oasis
  const params = new URLSearchParams(data);
  const action = params.get('action');
  const product = params.get('product');

  if (action === 'review') {
    // เก็บข้อมูล context สำหรับการสนทนาต่อไป
    console.log(`User ${userId} wants to review ${product}`);
  } else if (action === 'claim') {
    console.log(`User ${userId} wants to file a claim`);
  }
}
