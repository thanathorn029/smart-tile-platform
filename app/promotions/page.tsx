'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AuthGuard from '@/app/components/AuthGuard';
import { supabase } from '@/app/utils/supabase';

interface PromotionItem {
  id: number;
  name: string;
  image_url: string;
  original_price: number;
  sale_price: number;
  discount_badge: string;
  end_date?: string;
}

const DEMO_PROMOTIONS: PromotionItem[] = [
  {
    id: 1,
    name: 'Lunar Oasis Marble',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    original_price: 950,
    sale_price: 720,
    discount_badge: 'ลด 24%',
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Super White Glossy',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    original_price: 520,
    sale_price: 399,
    discount_badge: 'ลด 23%',
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'Gray Volcanic Stone',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
    original_price: 610,
    sale_price: 450,
    discount_badge: 'ราคาพิเศษ',
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionItem[]>(DEMO_PROMOTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('product_promotions').select('*').order('end_date', { ascending: true });
        if (!error && data && data.length > 0) {
          setPromotions(data as PromotionItem[]);
        }
      } catch (err) {
        console.error('fetch promotions error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const formatPrice = (value: number) => `฿${value.toLocaleString()}`;
  const calculateDiscount = (original: number, sale: number) => Math.round(((original - sale) / original) * 100);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] via-[#121518] to-[#0b1116] text-white font-sans px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">โปรโมชั่นกระเบื้อง</p>
              <h1 className="text-4xl font-black">โปรโมชั่นวันนี้</h1>
              <p className="mt-2 text-sm text-white/60">ดูและจัดการโปรโมชั่นสินค้าของคุณได้ที่นี่</p>
            </div>
            <div className="rounded-3xl bg-black/20 px-5 py-3 text-sm text-white/70">
              {loading ? 'กำลังโหลดโปรโมชั่น...' : `${promotions.length} โปรโมชั่น`}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {promotions.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-xl">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={promo.image_url}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg">{promo.discount_badge}</div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-white">{promo.name}</h2>
                  <p className="mt-3 text-sm text-white/60">โปรโมชั่นพิเศษสำหรับลูกค้าที่ต้องการงานปูกระเบื้องคุณภาพสูง</p>
                  <div className="mt-5 flex items-end gap-3">
                    <div>
                      <p className="text-3xl font-black text-amber-400">{formatPrice(promo.sale_price)}</p>
                      <p className="text-sm line-through text-white/50">{formatPrice(promo.original_price)}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">-{calculateDiscount(promo.original_price, promo.sale_price)}%</span>
                  </div>
                  {promo.end_date && (
                    <div className="mt-4 rounded-3xl bg-white/5 px-4 py-3 text-sm text-white/70">
                      หมดอายุ {new Date(promo.end_date).toLocaleDateString('th-TH')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
