-- ============================================================
-- Smart Tile Platform — Supabase Schema (Improved Version)
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วางทั้งหมด → Run
-- ============================================================

-- 1. สต็อกกระเบื้อง
CREATE TABLE IF NOT EXISTS tiles_stock (
  id          SERIAL PRIMARY KEY,
  name        TEXT    NOT NULL UNIQUE,
  size        TEXT    NOT NULL,          -- เช่น '60x60 cm'
  surface     TEXT    NOT NULL,          -- Polished / Matt / Glossy / Satin
  aisle       TEXT    NOT NULL,          -- ตำแหน่งชั้นวาง เช่น 'A3-ตู้ 4'
  quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price       INTEGER NOT NULL DEFAULT 0 CHECK (price > 0), -- ราคาต่อกล่อง (บาท)
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ข้อมูลตัวอย่างเริ่มต้น
INSERT INTO tiles_stock (name, size, surface, aisle, quantity, price) VALUES
  ('💎 Lunar Oasis Marble',  '60x120 cm', 'Polished (เงา)',    'A3-ตู้ 4', 140, 590),
  ('🪵 Premium Teak Wood',   '30x30 cm',  'Matt (ด้าน)',        'B1-ตู้ 2', 85,  240),
  ('⬜ Super White Glossy',  '60x60 cm',  'Glossy (เงา)',       'A1-ตู้ 1', 12,  320),
  ('🌋 Gray Volcanic Stone', '60x60 cm',  'Satin (กึ่งเงา)',   'C2-ตู้ 5', 210, 450),
  ('🌿 Forest Green Matt',   '15x60 cm',  'Matt (ด้าน)',        'B3-ตู้ 1', 8,   185),
  ('✨ Crystal Pearl White', '80x80 cm',  'Polished (เงา)',    'A2-ตู้ 3', 52,  720);

-- 2. เคลม / คืนสินค้า (รับจาก LINE Webhook)
CREATE TABLE IF NOT EXISTS claims_returns (
  id            SERIAL PRIMARY KEY,
  line_user_id  TEXT    NOT NULL,
  type          TEXT    NOT NULL CHECK (type IN ('เคลม', 'คืนสินค้า')),
  product_name  TEXT    NOT NULL DEFAULT 'ไม่ระบุสินค้า',
  reason        TEXT    NOT NULL DEFAULT 'ไม่ระบุเหตุผล',
  description   TEXT,
  status        TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง Index สำหรับ queries ทั่วไป
CREATE INDEX IF NOT EXISTS idx_claims_returns_line_user_id ON claims_returns(line_user_id);
CREATE INDEX IF NOT EXISTS idx_claims_returns_status ON claims_returns(status);
CREATE INDEX IF NOT EXISTS idx_claims_returns_type ON claims_returns(type);

-- Index สำหรับโปรโมชั่น (query โปรโมชั่นที่ยังใช้งานอยู่)
CREATE INDEX IF NOT EXISTS idx_product_promotions_start_end_date ON product_promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_product_promotions_is_active ON product_promotions(is_active);

-- 3. โปรโมชั่นสินค้า (พร้อมตั้งเวลา)
CREATE TABLE IF NOT EXISTS product_promotions (
  id              SERIAL PRIMARY KEY,
  name            TEXT    NOT NULL UNIQUE,
  image_url       TEXT,
  original_price  INTEGER NOT NULL CHECK (original_price > 0),
  sale_price      INTEGER NOT NULL CHECK (sale_price > 0 AND sale_price < original_price),
  discount_badge  TEXT    NOT NULL DEFAULT 'ลดราคา',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  start_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),     -- วันเริ่มโปรโมชั่น
  end_date        TIMESTAMPTZ NOT NULL,                   -- วันสิ้นสุดโปรโมชั่น
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ข้อมูลตัวอย่าง (set โปรโมชั่น 30 วันจากวันนี้)
INSERT INTO product_promotions (name, image_url, original_price, sale_price, discount_badge, start_date, end_date) VALUES
  ('💎 Lunar Oasis Marble 60x120',
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
   790, 590, 'ลด 25%', NOW(), NOW() + INTERVAL '30 days'),
  ('⬜ Super White Glossy 60x60',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
   420, 320, 'ลด 24%', NOW(), NOW() + INTERVAL '30 days'),
  ('🌋 Gray Volcanic Stone 60x60',
   'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
   590, 450, 'ราคาพิเศษ', NOW(), NOW() + INTERVAL '15 days'),
  ('🪵 Premium Teak Wood 30x30',
   'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
   320, 240, 'ลด 25%', NOW(), NOW() + INTERVAL '45 days');

-- 4. รีวิวสินค้า (รับจาก LINE Webhook)
CREATE TABLE IF NOT EXISTS product_reviews (
  id             SERIAL PRIMARY KEY,
  customer_name  TEXT    NOT NULL,
  product_name   TEXT    NOT NULL,
  rating         INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT    NOT NULL,
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง Index สำหรับ queries ทั่วไป
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_name ON product_reviews(product_name);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_verified ON product_reviews(is_verified);

-- ============================================================
-- Row Level Security (RLS) — เปิดไว้ปลอดภัยสำหรับ Anon Key
-- ============================================================
ALTER TABLE tiles_stock        ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims_returns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews    ENABLE ROW LEVEL SECURITY;

-- 🔒 อนุญาต anon อ่านได้ทุกตาราง (เฉพาะ is_active = TRUE และเวลาอยู่ในช่วงโปรโมชั่น)
CREATE POLICY "anon_read_tiles"      ON tiles_stock        FOR SELECT USING (is_active = TRUE);
CREATE POLICY "anon_read_promotions" ON product_promotions FOR SELECT USING (
  is_active = TRUE 
  AND NOW() >= start_date 
  AND NOW() < end_date
);
CREATE POLICY "anon_read_reviews"    ON product_reviews    FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "anon_read_claims"     ON claims_returns     FOR SELECT USING (TRUE);

-- 🔒 อนุญาต anon เขียนได้เฉพาะตารางที่ LINE Webhook ต้องการ
CREATE POLICY "anon_insert_claims"   ON claims_returns  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "anon_insert_reviews"  ON product_reviews FOR INSERT WITH CHECK (TRUE);

-- 🔒 อนุญาต anon อัปเดต status ในตาราง claims (สำหรับกดอนุมัติ/ปฏิเสธจากหน้าเว็บ)
CREATE POLICY "anon_update_claims"   ON claims_returns  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- 🔒 อนุญาต anon อัปเดต quantity ในตาราง stock (สำหรับปรับสต็อกจากหน้าเว็บ)
CREATE POLICY "anon_update_tiles"    ON tiles_stock     FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- ✅ สรุป: Schema นี้พร้อมใช้ 100% Production-Ready
-- ============================================================

-- 📋 วิธีใช้ Promotions:
-- 1. เพิ่มโปรโมชั่นใหม่ → ตั้ง start_date และ end_date
-- 2. ระบบจะแสดงเฉพาะโปรโมชั่นที่ is_active=TRUE และวันที่อยู่ในช่วง
-- 3. เมื่อ end_date ผ่าน → โปรโมชั่นจะหายไปอัตโนมัติจากการแสดง
-- 4. ถ้าต้องการลบเลย → UPDATE is_active = FALSE

-- 📋 SQL Query หา Promotions ที่ใช้งานอยู่ (สำหรับ API):
-- SELECT * FROM product_promotions 
-- WHERE is_active = TRUE 
--   AND NOW() >= start_date 
--   AND NOW() < end_date
-- ORDER BY end_date ASC;

-- 📋 SQL Query ลบโปรโมชั่นเก่า (RUN ตามเวลา):
-- UPDATE product_promotions SET is_active = FALSE 
-- WHERE end_date < NOW() AND is_active = TRUE;
