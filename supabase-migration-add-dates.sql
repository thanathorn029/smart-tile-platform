-- ============================================================
-- Migration: Tambah start_date dan end_date ให้ product_promotions
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วางทั้งหมด → Run
-- ============================================================

-- เพิ่มคอลัมน์ใหม่ที่ product_promotions
ALTER TABLE product_promotions
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- สร้าง Index สำหรับโปรโมชั่น (query โปรโมชั่นที่ยังใช้งานอยู่)
CREATE INDEX IF NOT EXISTS idx_product_promotions_start_end_date ON product_promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_product_promotions_is_active ON product_promotions(is_active);

-- อัปเดต RLS Policy ให้มีการตรวจสอบวันที่
DROP POLICY IF EXISTS "anon_read_promotions" ON product_promotions;

CREATE POLICY "anon_read_promotions" ON product_promotions FOR SELECT USING (
  is_active = TRUE 
  AND NOW() >= start_date 
  AND NOW() < end_date
);

-- ============================================================
-- ✅ เสร็จ! ตอนนี้ product_promotions มี start_date และ end_date แล้ว
-- ============================================================
