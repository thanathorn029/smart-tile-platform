'use client';

import Link from 'next/link';
import React from 'react';

export default function ProtectedLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
