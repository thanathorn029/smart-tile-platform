# API Reference - Smart Tile Platform

## Base URL
```
http://localhost:3000/api
```

---

## 📦 Stocks - `/stocks`

### GET /api/stocks
ดึงสต็อกทั้งหมดที่ใช้งาน

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "💎 Lunar Oasis Marble",
      "size": "60x120 cm",
      "surface": "Polished",
      "aisle": "A3-ตู้ 4",
      "quantity": 140,
      "price": 590,
      "is_active": true,
      "created_at": "2026-06-26T10:00:00Z",
      "updated_at": "2026-06-26T10:00:00Z"
    }
  ]
}
```

### POST /api/stocks
เพิ่มสต็อกใหม่

**Request Body:**
```json
{
  "name": "💎 Lunar Oasis Marble",
  "size": "60x120 cm",
  "surface": "Polished",
  "aisle": "A3-ตู้ 4",
  "quantity": 140,
  "price": 590
}
```

**Response (201):**
```json
{
  "success": true,
  "data": [{ "id": 1, ... }]
}
```

### PUT /api/stocks
อัปเดตสต็อก

**Request Body:**
```json
{
  "id": 1,
  "quantity": 120,
  "price": 600,
  "aisle": "A3-ตู้ 5"
}
```

---

## 🏷️ Promotions - `/promotions`

### GET /api/promotions
ดึงโปรโมชั่นที่ใช้งานและยังไม่หมดอายุ

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "💎 Lunar Oasis Marble 60x120",
      "image_url": "https://...",
      "original_price": 790,
      "sale_price": 590,
      "discount_badge": "ลด 25%",
      "is_active": true,
      "start_date": "2026-06-26T00:00:00Z",
      "end_date": "2026-07-26T23:59:59Z",
      "created_at": "2026-06-26T10:00:00Z",
      "updated_at": "2026-06-26T10:00:00Z"
    }
  ]
}
```

### POST /api/promotions
เพิ่มโปรโมชั่นใหม่

**Request Body:**
```json
{
  "name": "💎 Lunar Oasis Marble 60x120",
  "image_url": "https://images.unsplash.com/...",
  "original_price": 790,
  "sale_price": 590,
  "discount_badge": "ลด 25%",
  "start_date": "2026-06-26T00:00:00Z",
  "end_date": "2026-07-26T23:59:59Z"
}
```

⚠️ **Validation:**
- `sale_price` ต้องน้อยกว่า `original_price`
- `end_date` เป็นบังคับ

### PUT /api/promotions
ปรับปรุงโปรโมชั่น (เช่น ลบก่อนเวลา)

**Request Body:**
```json
{
  "id": 1,
  "is_active": false,
  "end_date": "2026-06-30T23:59:59Z"
}
```

---

## 🚨 Claims - `/claims`

### GET /api/claims
ดึงรายการเคลม/คืนสินค้า

**Query Parameters:**
- `status` - `pending` | `approved` | `rejected`
- `type` - `เคลม` | `คืนสินค้า`

**Example:**
```
GET /api/claims?status=pending&type=เคลม
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "line_user_id": "U1234567890abcdef",
      "type": "เคลม",
      "product_name": "💎 Lunar Oasis Marble",
      "reason": "สินค้าเสียหาย",
      "description": "บริเวณมุมหักสลักเล็กน้อย",
      "status": "pending",
      "created_at": "2026-06-26T09:30:00Z",
      "updated_at": "2026-06-26T09:30:00Z"
    }
  ]
}
```

### POST /api/claims
สร้างเคลม/คืนสินค้าใหม่ (มักจากจาก LINE)

**Request Body:**
```json
{
  "line_user_id": "U1234567890abcdef",
  "type": "เคลม",
  "product_name": "💎 Lunar Oasis Marble",
  "reason": "สินค้าเสียหาย",
  "description": "บริเวณมุมหักสลักเล็กน้อย"
}
```

**Validation:**
- `type` ต้องเป็น `เคลม` หรือ `คืนสินค้า`

### PUT /api/claims
อนุมัติ/ปฏิเสธเคลม

**Request Body:**
```json
{
  "id": 1,
  "status": "approved"
}
```

**Allowed statuses:** `pending`, `approved`, `rejected`

---

## ⭐ Reviews - `/reviews`

### GET /api/reviews
ดึงรีวิวที่ยืนยัน

**Query Parameters:**
- `product` - ชื่อสินค้า
- `minRating` - คะแนนต่ำสุด (1-5)

**Example:**
```
GET /api/reviews?product=Lunar%20Oasis&minRating=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "คุณสมชาย",
      "product_name": "💎 Lunar Oasis Marble",
      "rating": 5,
      "comment": "กระเบื้องสวยมาก ทนทานดี!",
      "is_verified": true,
      "created_at": "2026-06-25T14:20:00Z",
      "updated_at": "2026-06-26T09:00:00Z"
    }
  ]
}
```

### POST /api/reviews
สร้างรีวิวใหม่ (จะต้องยืนยันก่อน)

**Request Body:**
```json
{
  "customer_name": "คุณสมชาย",
  "product_name": "💎 Lunar Oasis Marble",
  "rating": 5,
  "comment": "กระเบื้องสวยมาก ทนทานดี!"
}
```

**Validation:**
- `rating` ต้องเป็น 1-5
- `is_verified` จะเป็น `false` โดยค่าเริ่มต้น

### PUT /api/reviews
ยืนยัน/ปฏิเสธรีวิว (Admin เท่านั้น)

**Request Body:**
```json
{
  "id": 1,
  "is_verified": true
}
```

---

## 🤖 LINE Webhook - `/line/webhook`

### POST /api/line/webhook
รับข้อมูลจาก LINE (Automatic)

**Headers:**
- `x-line-signature` - ลายเซนต์ LINE (ตรวจสอบอัตโนมัติ)

**Line ส่งมาเองอัตโนมัติ:**
```json
{
  "events": [
    {
      "type": "message",
      "replyToken": "...",
      "source": { "userId": "U1234567890abcdef" },
      "message": { "type": "text", "text": "เคลม กระเบื้องเสียหาย" }
    }
  ]
}
```

**Webhook ประมวลผล:**
- ค้นหาคำสำคัญ: "เคลม", "คืน", "รีวิว"
- สร้าง claim/return record อัตโนมัติ
- บันทึก LINE User ID เพื่อติดตามลูกค้า

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid signature"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Database connection error"
}
```

---

## 🔐 Security Headers

ทุก request ควรมี:
```
Content-Type: application/json
```

สำหรับ Webhook จาก LINE ต้องตรวจสอบ:
```
x-line-signature: <ลายเซนต์>
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200  | ✅ สำเร็จ (GET/PUT) |
| 201  | ✅ สร้างสำเร็จ (POST) |
| 400  | ❌ ข้อมูลไม่ถูกต้อง |
| 401  | ❌ ไม่ผ่านการตรวจสอบ |
| 500  | ❌ ข้อผิดพลาด Server |

---

## 🧪 Testing with cURL

### ทดสอบ GET
```bash
curl -X GET "http://localhost:3000/api/stocks"
```

### ทดสอบ POST
```bash
curl -X POST "http://localhost:3000/api/stocks" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","size":"60x60","surface":"Polished","aisle":"A1","quantity":10,"price":100}'
```

### ทดสอบ PUT
```bash
curl -X PUT "http://localhost:3000/api/stocks" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"quantity":20}'
```

---

**Last Updated:** 2026-06-26
