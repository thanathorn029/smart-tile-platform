import { supabase } from '@/app/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET — ดึงรายการเคลม/คืนสินค้า
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase.from('claims_returns').select('*');

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST — สร้างเคลม/คืนสินค้าใหม่ (จาก LINE Webhook)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      line_user_id,
      type,
      product_name,
      reason,
      description,
    } = body;

    if (!line_user_id || !type || !['เคลม', 'คืนสินค้า'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('claims_returns')
      .insert([{
        line_user_id,
        type,
        product_name: product_name || 'ไม่ระบุสินค้า',
        reason: reason || 'ไม่ระบุเหตุผล',
        description,
        status: 'pending',
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT — อัปเดตสถานะ (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (
      !id ||
      !status ||
      !['pending', 'approved', 'rejected'].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('claims_returns')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
