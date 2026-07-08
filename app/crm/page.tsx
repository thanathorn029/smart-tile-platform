'use client';

import React, { useEffect, useState } from 'react';
import AuthGuard from '@/app/components/AuthGuard';
import { supabase } from '@/app/utils/supabase';

interface ClaimReturnItem {
  id: number;
  line_user_id: string;
  type: 'เคลม' | 'คืนสินค้า';
  product_name: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function CRMPage() {
  const [items, setItems] = useState<ClaimReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const loadCRMData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('claims_returns').select('*').order('created_at', { ascending: false });
      if (!error && data) setItems(data as ClaimReturnItem[]);
      setLoading(false);
    };

    void loadCRMData();
  }, []);

  const fetchCRMData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('claims_returns').select('*').order('created_at', { ascending: false });
    if (!error && data) setItems(data as ClaimReturnItem[]);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    await supabase.from('claims_returns').update({ status: newStatus }).eq('id', id);
    fetchCRMData();
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const pending = items.filter(i => i.status === 'pending').length;
  const approved = items.filter(i => i.status === 'approved').length;
  const rejected = items.filter(i => i.status === 'rejected').length;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] via-[#121518] to-[#0b1116] text-white font-sans overflow-hidden px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">CRM</p>
                <h1 className="text-4xl font-black">จัดการเคลมและคืนสินค้า</h1>
                <p className="mt-2 text-sm text-white/60">ตรวจสอบรายการจาก LINE และอัปเดตสถานะได้ทันที</p>
              </div>
              <button
                onClick={fetchCRMData}
                className="rounded-3xl bg-emerald-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600/30"
              >
                รีเฟรชข้อมูล
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {[
              { label: 'ทั้งหมด', value: items.length, color: 'from-blue-500/20', border: 'border-blue-500/30' },
              { label: 'รอตรวจสอบ', value: pending, color: 'from-amber-500/20', border: 'border-amber-500/30' },
              { label: 'อนุมัติแล้ว', value: approved, color: 'from-emerald-500/20', border: 'border-emerald-500/30' },
              { label: 'ปฏิเสธแล้ว', value: rejected, color: 'from-rose-500/20', border: 'border-rose-500/30' },
            ].map((stat, index) => (
              <div key={index} className={`rounded-3xl border ${stat.border} bg-gradient-to-br ${stat.color} to-transparent p-6`}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((f) => {
                const LABEL = { all: 'ทั้งหมด', pending: 'รอตรวจ', approved: 'อนุมัติ', rejected: 'ปฏิเสธ' };
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${filter === f ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  >
                    {LABEL[f]}
                  </button>
                );
              })}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-white/10 text-white/50 uppercase tracking-[0.15em] text-xs">
                  <tr>
                    <th className="p-4">ประเภท</th>
                    <th className="p-4">สินค้า / เหตุผล</th>
                    <th className="p-4">LINE User</th>
                    <th className="p-4">วันที่</th>
                    <th className="p-4">สถานะ</th>
                    <th className="p-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={6} className="py-12 text-center text-white/40">กำลังโหลดข้อมูล...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-white/40">ไม่มีรายการ</td></tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${item.type === 'เคลม' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{item.product_name}</div>
                          <div className="text-xs text-white/50 mt-1">{item.reason}</div>
                        </td>
                        <td className="p-4 text-sm font-mono text-white/70">{item.line_user_id.slice(0, 12)}...</td>
                        <td className="p-4 text-sm text-white/60">{new Date(item.created_at).toLocaleDateString('th-TH')}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${item.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {item.status === 'pending' ? 'รอตรวจ' : item.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                          </span>
                        </td>
                        <td className="p-4">
                          {item.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'approved')}
                                className="rounded-2xl bg-emerald-600/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600/30"
                              >อนุมัติ</button>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                className="rounded-2xl bg-rose-600/20 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-600/30"
                              >ปฏิเสธ</button>
                            </div>
                          ) : (
                            <span className="text-xs text-white/50">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
