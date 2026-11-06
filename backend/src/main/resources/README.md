# Backend

Backend อยู่ใน `backend/src` และพัฒนาด้วย Java 17, Spring Boot, Spring Web MVC, Spring Data JPA และ H2 Database

## โครงสร้าง

```text
backend/src/
├── main/
│   ├── java/com/example/ordermanagement/
│   │   ├── controller/  # REST endpoints
│   │   ├── service/     # กฎธุรกิจและการคำนวณยอดรวม
│   │   ├── repository/  # Spring Data JPA
│   │   └── model/       # Order และ OrderItem
│   └── resources/
│       └── application.properties
└── test/                # การทดสอบ Backend
```

Frontend อยู่แยกที่โฟลเดอร์ `frontend` และ Maven จะคัดลอกเข้า `static` ตอน build

## API

| Method | Endpoint | การทำงาน |
|---|---|---|
| `GET` | `/orders` | ดูทั้งหมด |
| `GET` | `/orders/{id}` | ดูตาม ID |
| `POST` | `/orders` | สร้าง |
| `PUT` | `/orders/{id}` | แก้ไข |
| `DELETE` | `/orders/{id}` | ลบ |

เมื่อรันด้วย Docker ใช้ <http://localhost:8082/orders> เมื่อรัน Java โดยตรงใช้ <http://localhost:8081/orders>

## ฐานข้อมูล

- Docker: H2 แบบไฟล์ที่ `jdbc:h2:file:/data/orders` และเก็บใน volume `order_data`
- Java โดยตรง: H2 แบบ in-memory ตาม `application.properties`

ดูขั้นตอนรันและค่าของ H2 Console ได้ใน [README หลัก](../../../../README.md)
