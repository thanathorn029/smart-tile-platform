'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';
import ProtectedLink from '@/app/components/ProtectedLink';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      if (!data?.session) {
        router.replace('/login');
        return;
      }

      setEmail(data.session.user.email || null);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] via-[#121518] to-[#0b1116] text-white font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/60 uppercase tracking-[0.35em] font-bold mb-2">แดชบอร์ดผู้ใช้งาน</p>
            <h1 className="text-4xl font-black">ยินดีต้อนรับสู่ระบบ</h1>
            <p className="mt-2 text-sm text-white/60">จัดการโปรโมชั่น สต็อก และงานขายกระเบื้องได้จากที่เดียว</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-3xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-black/20 p-8 text-center text-white/70">กำลังตรวจสอบข้อมูลผู้ใช้...</div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-sm text-rose-200">{error}</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-3">บัญชี</p>
              <p className="text-xl font-semibold text-white">{email || 'ไม่พบอีเมล'}</p>
              <p className="mt-2 text-sm text-white/60">คุณสามารถเข้าถึงเมนูจัดการระบบได้จากลิงก์ด้านล่าง</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 space-y-4">
              <ProtectedLink href="/promotions">ดูโปรโมชั่น</ProtectedLink>
              <ProtectedLink href="/calculator">เครื่องคิดเลขกระเบื้อง</ProtectedLink>
              <ProtectedLink href="/crm">CRM เคลม/คืนสินค้า</ProtectedLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
