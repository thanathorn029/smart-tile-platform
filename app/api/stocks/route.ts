import { supabase } from '@/app/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET — ดึงข้อมูลสต็อก
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tiles_stock')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST — เพิ่มสต็อกใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, size, surface, aisle, quantity, price } = body;

    if (!name || !size || !surface || !aisle || quantity === undefined || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tiles_stock')
      .insert([{
        name,
        size,
        surface,
        aisle,
        quantity: parseInt(quantity),
        price: parseInt(price),
        is_active: true,
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT — อัปเดตสต็อก
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity, price, aisle } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (price !== undefined) updateData.price = parseInt(price);
    if (aisle !== undefined) updateData.aisle = aisle;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('tiles_stock')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
