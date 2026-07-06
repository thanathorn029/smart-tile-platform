# Smart Tile Platform - Complete Setup Guide ✅

ทั้งหมดนี้พร้อมใช้ 100% แล้วครับ! 🚀

## 📋 มีอะไรบ้าง?

### 1. **API Routes** (Backend Integration)
- ✅ `/api/stocks` — จัดการสต็อกกระเบื้อง (CRUD)
- ✅ `/api/promotions` — จัดการโปรโมชั่น (เพิ่ม/ลบ/อัปเดต)
- ✅ `/api/claims` — จัดการเคลมและคืนสินค้า
- ✅ `/api/reviews` — จัดการรีวิวสินค้า
- ✅ `/api/line/webhook` — รับข้อมูลจาก LINE Webhook

### 2. **UI Components** (Frontend Management)
- ✅ `StockManager.tsx` — ตารางสต็อกพร้อมแก้ไขจำนวน
- ✅ `PromotionManager.tsx` — จัดการโปรโมชั่นพร้อมตั้งเวลา
- ✅ `ClaimsManager.tsx` — ตรวจสอบและจัดการเคลม/คืน
- ✅ `ReviewsManager.tsx` — ยืนยันและจัดการรีวิว

### 3. **Admin Dashboard**
- ✅ `/admin` — หน้าจัดการระบบ (รวมทุกฟีเจอร์)

---

## 🔧 ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในรูท project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# LINE (Optional - สำหรับ Webhook)
LINE_CHANNEL_SECRET=YOUR_LINE_CHANNEL_SECRET
```

---

## 🚀 วิธีใช้ API Routes

### 1️⃣ **Stocks API** - `/api/stocks`

#### GET - ดึงสต็อกทั้งหมด
```bash
curl http://localhost:3000/api/stocks
```

#### POST - เพิ่มสต็อกใหม่
```bash
curl -X POST http://localhost:3000/api/stocks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "💎 Lunar Oasis Marble",
    "size": "60x120 cm",
    "surface": "Polished",
    "aisle": "A3-ตู้ 4",
    "quantity": 140,
    "price": 590
  }'
```

#### PUT - อัปเดตสต็อก
```bash
curl -X PUT http://localhost:3000/api/stocks \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "quantity": 120,
    "price": 600
  }'
```

---

### 2️⃣ **Promotions API** - `/api/promotions`

#### GET - ดึงโปรโมชั่นที่ใช้งาน
```bash
curl http://localhost:3000/api/promotions
```

#### POST - เพิ่มโปรโมชั่นใหม่
```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "💎 Lunar Oasis Marble 60x120",
    "image_url": "https://...",
    "original_price": 790,
    "sale_price": 590,
    "discount_badge": "ลด 25%",
    "end_date": "2026-07-26T23:59:59Z"
  }'
```

#### PUT - อัปเดตโปรโมชั่น
```bash
curl -X PUT http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "is_active": false
  }'
```

---

### 3️⃣ **Claims API** - `/api/claims`

#### GET - ดึงเคลมทั้งหมด
```bash
curl http://localhost:3000/api/claims
```

#### GET - ดึงเฉพาะ pending
```bash
curl "http://localhost:3000/api/claims?status=pending"
```

#### POST - สร้างเคลมใหม่
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "line_user_id": "U1234567890abcdef1234567890abcdef",
    "type": "เคลม",
    "product_name": "💎 Lunar Oasis Marble",
    "reason": "สินค้าเสียหาย"
  }'
```

#### PUT - อนุมัติ/ปฏิเสธ
```bash
curl -X PUT http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "approved"
  }'
```

---

### 4️⃣ **Reviews API** - `/api/reviews`

#### GET - ดึงรีวิวที่ยืนยัน
```bash
curl http://localhost:3000/api/reviews
```

#### POST - สร้างรีวิวใหม่
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "คุณสมชาย",
    "product_name": "💎 Lunar Oasis Marble",
    "rating": 5,
    "comment": "กระเบื้องสวยมาก ทนทานดี!"
  }'
```

#### PUT - ยืนยันรีวิว
```bash
curl -X PUT http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "is_verified": true
  }'
```

---

## 📱 LINE Webhook Setup

### 1. ไปที่ LINE Developers Console
https://developers.line.biz/console/

### 2. ตั้ง Webhook URL
```
https://yourdomain.com/api/line/webhook
```

### 3. ใน `.env.local` เพิ่ม:
```env
LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET
```

### 4. ทำการทดสอบ
LINE จะส่ง POST request ไป webhook ทุกครั้งที่ผู้ใช้ส่งข้อความมา

---

## 🎨 Admin Dashboard Features

### 📦 Stocks Tab
- ดูรายการสินค้าทั้งหมด
- เพิ่มสต็อกใหม่
- แก้ไขจำนวน/ราคาโดยตรง
- ⚠️ เตือนเมื่อสต็อกน้อยกว่า 10

### 🏷️ Promotions Tab
- ดูโปรโมชั่นที่ใช้งาน
- เพิ่มโปรโมชั่นใหม่พร้อมตั้งเวลา
- แสดงจำนวนวันเหลือ
- ลบโปรโมชั่นเก่า

### 🚨 Claims Tab
- ตรวจสอบเคลม/คืนสินค้า
- กรองตามสถานะ (pending/approved/rejected)
- อนุมัติหรือปฏิเสธโดยตรง

### ⭐ Reviews Tab
- ยืนยันรีวิวก่อนแสดง
- ดูคะแนนเฉลี่ย
- กรองตามสถานะ (verified/pending)

---

## 📊 Database Structure (Supabase)

### `tiles_stock`
```
id (PK) | name | size | surface | aisle | quantity | price | is_active | created_at | updated_at
```

### `product_promotions`
```
id (PK) | name | image_url | original_price | sale_price | discount_badge | 
is_active | start_date | end_date | created_at | updated_at
```

### `claims_returns`
```
id (PK) | line_user_id | type | product_name | reason | description | 
status | created_at | updated_at
```

### `product_reviews`
```
id (PK) | customer_name | product_name | rating | comment | 
is_verified | created_at | updated_at
```

---

## 🔐 Security Notes

✅ **RLS Policies** ตั้งไว้แล้ว:
- Anon สามารถ READ ได้ (เฉพาะ is_active = TRUE)
- โปรโมชั่นแสดงเฉพาะในช่วงเวลา
- รีวิวแสดงเฉพาะที่ยืนยัน
- INSERT/UPDATE ได้เฉพาะตามกฎ

⚠️ **TODO ยังต้อง Setup**:
- Authentication (Admin Login)
- Rate Limiting
- Input Validation (Backend)
- Error Logging

---

## 📦 Dependencies

ติดตั้งแล้ว:
```json
{
  "@supabase/supabase-js": "^2.108.2",
  "next": "16.2.9",
  "react": "19.2.4"
}
```

---

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Access Pages
- 🏠 Home: http://localhost:3000
- 💬 CRM: http://localhost:3000/crm
- 📦 Stocks: http://localhost:3000/stocks
- 🧮 Calculator: http://localhost:3000/calculator
- 🏷️ Promotions: http://localhost:3000/promotions
- ⚙️ **Admin Dashboard**: http://localhost:3000/admin ← **NEW**

---

## 💡 ตัวอย่าง Workflow

### 1. เพิ่มโปรโมชั่นใหม่
1. ไปที่ `/admin`
2. คลิก "🏷️ โปรโมชั่น"
3. กรอกข้อมูล (ชื่อ, ราคา, วันสิ้นสุด)
4. คลิก "✅ เพิ่มโปรโมชั่น"
5. ระบบจะแสดงให้ลูกค้าเห็น อัตโนมัติ

### 2. รับเคลมจาก LINE
1. ลูกค้าส่ง "เคลม กระเบื้องเสียหาย" ไป LINE Bot
2. Webhook บันทึกข้อมูลลง `claims_returns`
3. Admin ไปที่ `/admin` → "🚨 เคลม/คืนสินค้า"
4. คลิกเคลม → "✅ อนุมัติ" หรือ "❌ ปฏิเสธ"

### 3. บัญชีรีวิว
1. ลูกค้าส่งรีวิวผ่าน LINE
2. ระบบบันทึกเป็น `is_verified = FALSE`
3. Admin ตรวจสอบ & ยืนยัน
4. รีวิวแสดงบน `promotions` page อัตโนมัติ

---

## 🎯 Next Steps (Optional)

- [ ] เพิ่ม Authentication สำหรับ Admin
- [ ] Dashboard Analytics (สถิติขาย)
- [ ] Export Report (Excel/PDF)
- [ ] Notification System
- [ ] Mobile App Sync

---

## 📞 Support

หากมีปัญหาจะบอกได้เลยครับ! 😊

**Created with ❤️ for Smart Tile Platform**
