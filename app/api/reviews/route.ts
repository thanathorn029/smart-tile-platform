import { supabase } from '@/app/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET — ดึงรีวิว (ที่ verified เท่านั้น)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const product = searchParams.get('product');
    const minRating = searchParams.get('minRating');

    let query = supabase
      .from('product_reviews')
      .select('*')
      .eq('is_verified', true);

    if (product) query = query.eq('product_name', product);
    if (minRating) query = query.gte('rating', parseInt(minRating));

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

// POST — สร้างรีวิวใหม่ (จาก LINE Webhook)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, product_name, rating, comment } = body;

    if (
      !customer_name ||
      !product_name ||
      !rating ||
      !comment ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .insert([{
        customer_name,
        product_name,
        rating: parseInt(rating),
        comment,
        is_verified: false, // รอการยืนยัน
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

// PUT — ยืนยันรีวิว (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_verified } = body;

    if (id === undefined || is_verified === undefined) {
      return NextResponse.json(
        { success: false, error: 'ID and is_verified are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .update({
        is_verified,
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
