'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session) {
        router.replace('/login');
        return;
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-white font-sans flex items-center justify-center px-4 py-10">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 px-8 py-6 text-center shadow-2xl backdrop-blur-2xl">
          <p className="text-lg font-semibold">กำลังตรวจสอบสิทธิ์...</p>
          <p className="mt-2 text-sm text-white/60">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
