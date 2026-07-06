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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0d12] font-sans text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b2340]/75 via-[#0b0d12]/20 to-[#0b0d12]/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <header className="relative z-30 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="flex flex-1 flex-col gap-3 rounded-full border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FilterField label="ประเภทกระเบื้อง" value="พื้น / ผนัง" />
            <FilterField label="วัสดุ" value="เซรามิค / หิน" />
            <FilterField label="งาน" value="ปูกระเบื้องบ้าน" />
          </div>
          <div className="flex items-center gap-2">
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/20 sm:px-5"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/20 sm:px-5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-row items-center gap-2 rounded-full border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:gap-3 sm:p-3">
        <SideIcon active>
          <Home size={18} strokeWidth={2} />
        </SideIcon>
        <SideIcon active={showPages} onClick={() => setShowPages((value) => !value)}>
          <LayoutGrid size={18} strokeWidth={2} />
        </SideIcon>
        <SideIcon>
          <Bell size={18} strokeWidth={2} />
        </SideIcon>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            userEmail
              ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'border border-white/15 text-white/70'
          }`}
          aria-label="Profile"
        >
          {userEmail ? userEmail.charAt(0).toUpperCase() : <User size={18} strokeWidth={2} />}
        </div>
      </nav>

      <div
        className={`fixed left-4 top-1/2 z-40 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-200 sm:left-20 ${
          showPages ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 pointer-events-none'
        }`}
      >
        <h4 className="mb-3 text-sm font-semibold text-white/80">Pages</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white/95 transition hover:bg-white/15"
                onClick={() => setShowPages(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                  <IconComp size={16} strokeWidth={2} />
                </span>
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="relative z-20 mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-8">
        <div className="mt-10 pl-0 sm:mt-16 sm:pl-16 lg:pl-24">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur-xl">
            Smart Tile Platform
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            ค้นหา
            <br />
            กระเบื้อง
            <br />
            ที่ใช่สำหรับบ้านคุณ
          </h1>
          <p className="mt-5 max-w-md pl-1 text-sm leading-relaxed text-white/70 sm:text-base">
            ระบบคำนวณวัสดุปูกระเบื้องพร้อมแนะนำทั้ง COTTO และ จระเข้
            ช่วยให้คุณวางแผนงานปูกระเบื้องได้ง่ายและแม่นยำมากขึ้น
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-7">
            <h3 className="text-lg font-semibold">คำนวณวัสดุปูกระเบื้อง</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              วัดพื้นที่ ปริมาณวัสดุ ปูนกาว ยาแนว และเลือกกระเบื้องให้ตรงกับผนังหรือพื้นบ้านคุณ
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#11151f]/80 p-4">
                <div className="text-3xl font-bold">65%</div>
                <div className="mt-1 text-[11px] text-white/50">ลดเวลาเลือกวัสดุ</div>
              </div>
              <div className="rounded-3xl bg-[#11151f]/80 p-4">
                <div className="text-3xl font-bold">2 แบรนด์</div>
                <div className="mt-1 text-[11px] text-white/50">COTTO และ จระเข้</div>
              </div>
              <div className="rounded-3xl bg-[#11151f]/80 p-4">
                <div className="text-3xl font-bold">รองรับปูทับ</div>
                <div className="mt-1 text-[11px] text-white/50">สำหรับงานพื้นและผนัง</div>
              </div>
              <div className="rounded-3xl bg-[#11151f]/80 p-4">
                <div className="text-3xl font-bold">มืออาชีพ</div>
                <div className="mt-1 text-[11px] text-white/50">ออกแบบเพื่อช่างและผู้ช่วยวางแผน</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Tile Style Collection</h3>
                <p className="mt-1 text-xs text-white/50">เมทัลสโตน, โมเสก, ลายหินอ่อน</p>
              </div>
              <button className="rounded-full border border-white/20 p-2 transition hover:bg-white/10">
                <ArrowUpRight size={16} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/60">
              แนะนำคอลเลคชั่นกระเบื้องบ้านที่ได้รับความนิยมสูงสุด พร้อมไอเดียปูกระเบื้อง
              ทั้งพื้นและผนัง สไตล์เรียบหรู และคุมโทนบ้านได้ง่าย
            </p>

            <div className="mt-5 grid gap-3 text-sm text-white/70">
              <div className="rounded-3xl bg-[#11151f]/80 p-3">พื้นบ้าน: กระเบื้องเซรามิคขนาด 60x60</div>
              <div className="rounded-3xl bg-[#11151f]/80 p-3">ผนังห้องน้ำ: กระเบื้องลายหินอ่อน</div>
              <div className="rounded-3xl bg-[#11151f]/80 p-3">ปูทับ: รองรับระบบปูทับกระเบื้องเดิม</div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-lg font-bold">
                T
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10">
                  <Heart size={16} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <a
        href="line://ti/p/@372vxxca"
        onClick={(e) => {
          if (!/line/.test(navigator.userAgent)) {
            e.preventDefault();
            window.open('https://line.me/R/ti/p/@372vxxca', '_blank');
          }
        }}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-green-600 sm:bottom-6"
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