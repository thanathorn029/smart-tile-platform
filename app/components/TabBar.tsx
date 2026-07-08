'use client';

import Link from 'next/link';
import React from 'react';

export default function TabBar({
  userEmail,
  showPages,
  onTogglePages,
}: {
  userEmail?: string | null;
  showPages: boolean;
  onTogglePages: () => void;
}) {
  return (
    <nav className="ios-tabbar fixed left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 p-2">
      <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 bg-white text-[#141824] shadow-lg" aria-label="Home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      </Link>

      <button
        onClick={onTogglePages}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
          showPages ? 'bg-white text-[#141824] shadow-lg' : 'text-white/70 hover:bg-white/15 hover:text-white'
        }`}
        aria-label="Pages"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      </button>

      <button className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18.5 14.5V11a6.5 6.5 0 0 0-13 0v3.5c0 .538-.214 1.055-.595 1.445L3 17h5" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
          userEmail ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' : 'border border-white/15 text-white/70'
        }`}
        aria-label="Profile"
      >
        {userEmail ? (
          userEmail.charAt(0).toUpperCase()
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
    </nav>
  );
}
