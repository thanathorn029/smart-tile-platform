import { supabase } from '@/app/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET — ดึงโปรโมชั่นที่ใช้งานอยู่
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('product_promotions')
      .select('*')
      .eq('is_active', true)
      .gt('end_date', new Date().toISOString())
      .order('end_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST — เพิ่มโปรโมชั่นใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      image_url,
      original_price,
      sale_price,
      discount_badge,
      start_date,
      end_date,
    } = body;

    if (
      !name ||
      !original_price ||
      !sale_price ||
      !end_date
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (sale_price >= original_price) {
      return NextResponse.json(
        { success: false, error: 'Sale price must be less than original price' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('product_promotions')
      .insert([{
        name,
        image_url,
        original_price: parseInt(original_price),
        sale_price: parseInt(sale_price),
        discount_badge: discount_badge || 'ลดราคา',
        start_date: start_date || new Date().toISOString(),
        end_date,
        is_active: true,
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

// PUT — อัปเดตโปรโมชั่น
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_active, end_date } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (is_active !== undefined) updateData.is_active = is_active;
    if (end_date !== undefined) updateData.end_date = end_date;

    const { data, error } = await supabase
      .from('product_promotions')
      .update(updateData)
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
