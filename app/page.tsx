'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/utils/supabase';
// Lightweight inline icon components to avoid dependency on `lucide-react`
function Icon({ children, size = 16, strokeWidth = 2 }: { children: React.ReactNode; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const Home = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
  </Icon>
);
const Search = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
);
const LayoutGrid = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </Icon>
);
const Bell = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18.5 14.5V11a6.5 6.5 0 0 0-13 0v3.5c0 .538-.214 1.055-.595 1.445L3 17h5" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);
const Heart = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l7.8-7.6a5.5 5.5 0 0 0 .0-7.8z" />
  </Icon>
);
const Share2 = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51L15.42 17.49" />
    <path d="M15.41 6.51L8.59 10.49" />
  </Icon>
);
const ArrowUpRight = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </Icon>
);

const Calculator = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h8" />
  </Icon>
);
const Chart = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M3 3v18h18" />
    <path d="M7 14v4M12 10v8M17 6v12" />
  </Icon>
);
const User = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);
const Megaphone = (props: { size?: number; strokeWidth?: number }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth}>
    <path d="M3 11v2a2 2 0 0 0 2 2h7l7 4V7l-7 4H5a2 2 0 0 0-2 0z" />
  </Icon>
);

/**
 * Recreation of the "New Way Of Living" property hero UI.
 * - Full-bleed dusk villa background
 * - Floating pill top bar (Buy/Rent segmented + filters)
 * - Floating pill left sidebar nav with avatar
 * - Bottom-left glass stat card ("Find The Perfect Place")
 * - Bottom-right glass listing card ("Lunar Oasis Villa")
 */

export default function HomePage() {
  const [showPages, setShowPages] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data?.session?.user.email || null);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Smart Tile Platform
              </p>
              <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                ค้นหากระเบื้องบ้านได้ง่ายขึ้น
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterField label="ประเภท" value="พื้น / ผนัง" />
              <FilterField label="วัสดุ" value="เซรามิค" />
              <FilterField label="งาน" value="ปูกระเบื้อง" />
              {userEmail ? (
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/20"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                คำนวณวัสดุอัตโนมัติ
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                รองรับ COTTO และ จระเข้
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              ค้นหากระเบื้องที่ใช่
              <br />
              สำหรับบ้านคุณได้ในไม่กี่คลิก
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              ระบบคำนวณพื้นที่ ปริมาณวัสดุ ปูนกาว และยาแนว พร้อมแนะนำกระเบื้องให้ตรงกับผนังหรือพื้นบ้านคุณ
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                เริ่มคำนวณเลย
              </Link>
              <button
                onClick={() => setShowPages((value) => !value)}
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {showPages ? 'ซ่อนเมนูหน้า' : 'ดูเมนูหน้า'}
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-2xl font-semibold text-white">65%</div>
                <div className="mt-1 text-xs text-slate-400">ลดเวลาเลือกวัสดุ</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-2xl font-semibold text-white">2 แบรนด์</div>
                <div className="mt-1 text-xs text-slate-400">COTTO และ จระเข้</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-2xl font-semibold text-white">ทุกงาน</div>
                <div className="mt-1 text-xs text-slate-400">พื้น ผนัง และปูทับ</div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">เมนูหลัก</p>
                  <p className="text-xs text-slate-400">เข้าถึงฟีเจอร์สำคัญได้ทันที</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80">
                  <LayoutGrid size={18} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  { href: '/calculator', label: 'Calculator', Icon: Calculator },
                  { href: '/crm', label: 'CRM', Icon: User },
                  { href: '/promotions', label: 'Promotions', Icon: Megaphone },
                ].map((p) => {
                  const IconComp = p.Icon as any;
                  return (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                          <IconComp size={16} strokeWidth={2} />
                        </span>
                        {p.label}
                      </span>
                      <ArrowUpRight size={14} />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/20 to-purple-500/15 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                  <Bell size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">พร้อมช่วยเหลือ</p>
                  <p className="text-xs text-slate-300">ติดต่อทีมงานผ่าน LINE ได้ทันที</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                ถ้าต้องการคำแนะนำแบบสด ๆ หรือมีข้อสงสัยเรื่องวัสดุ ให้กดปุ่ม LINE ด้านล่างได้เลย
              </p>
            </div>
          </aside>
        </main>
      </div>

      <a
        href="line://ti/p/@372vxxca"
        onClick={(e) => {
          if (!/line/.test(navigator.userAgent)) {
            e.preventDefault();
            window.open('https://line.me/R/ti/p/@372vxxca', '_blank');
          }
        }}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-green-600"
        title="Chat with us on LINE"
      >
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349-1.269.349-2.734-.436-3.884-1.141-1.745-3.255-2.501-5.369-2.501-3.584 0-6.533 2.202-6.533 5.001 0 1.284.495 2.467 1.314 3.382-.058.407-.349 2.467-.407 2.874-.058.610.611.524 1.058.262.349-.174 2.089-1.284 2.842-1.745.699.087 1.398.116 2.089.116 3.574 0 6.524-2.202 6.524-4.92 0-.699-.087-1.388-.262-2.068-.058.029-.116.029-.174.058 0 .466.058.932.058 1.397 0 2.262-2.089 3.884-4.885 3.884-.932 0-1.864-.174-2.680-.495l-1.512.942c-.436.262-1.058.349-1.397-.145-.232-.407.116-2.467.145-2.734-.465-.932-.814-1.922-.814-2.940 0-3.178 2.648-5.654 5.961-5.654 2.291 0 4.282.815 5.369 2.232.758 1.058.813 2.321.407 3.495l-.058.116z"/>
        </svg>
      </a>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-white/20" />;
}

function FilterField({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex flex-col items-start rounded-full px-5 py-1.5 text-left hover:bg-white/10 transition-all">
      <span className="text-[10px] text-white/50">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </button>
  );
}

function SideIcon({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
        active
          ? 'bg-white text-[#141824] shadow-md'
          : 'text-white/70 hover:bg-white/15 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}