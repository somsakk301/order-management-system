# Order Management System

ระบบจัดการคำสั่งซื้อสำหรับบันทึกข้อมูลลูกค้า เพิ่มสินค้าหลายรายการ คำนวณยอดรวม และดูคำสั่งซื้อย้อนหลัง พัฒนาด้วย Java, Spring Boot, Spring Data JPA, H2 Database และหน้าเว็บ HTML/CSS/JavaScript

- ทดลองระบบ: <https://somsakk301.github.io/order-management-system/>
- Source code: <https://github.com/somsakk301/order-management-system>

หน้า GitHub Pages ทำงานใน **Demo Mode** ข้อมูลที่ผู้ชมบันทึกจะเก็บใน `localStorage` ของเบราว์เซอร์แต่ละคนเท่านั้น จึงไม่เรียก Backend และไม่กระทบฐานข้อมูล H2 ส่วนการรันด้วย Docker จะยังเชื่อมต่อ Spring Boot และ H2 ตามปกติ

## ความสามารถ

- สร้างคำสั่งซื้อพร้อมข้อมูลลูกค้าและที่อยู่
- เพิ่ม แก้ไข และลบสินค้าหลายรายการก่อนบันทึก
- คำนวณยอดรวมของแต่ละรายการและยอดรวมคำสั่งซื้อ
- ดูคำสั่งซื้อย้อนหลังจากฐานข้อมูล
- ใช้งาน REST API สำหรับอ่าน สร้าง แก้ไข และลบคำสั่งซื้อ
- เปิดดูฐานข้อมูลผ่าน H2 Console ในเบราว์เซอร์
- รันระบบพร้อมฐานข้อมูลด้วย Docker Compose

## เทคโนโลยี

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | HTML, CSS, JavaScript, Bootstrap |
| Backend | Java 17, Spring Boot 4, Spring Web MVC |
| Database | Spring Data JPA, H2 Database |
| Build | Maven Wrapper |
| Container | Docker, Docker Compose |

## โครงสร้างโปรเจกต์

```text
order-management-preview/
├── frontend/
│   ├── index.html              # โครงสร้างหน้าเว็บ
│   ├── css/style.css           # รูปแบบ สี และการจัดวาง
│   └── js/app.js               # การทำงานของฟอร์มและการเรียก API
├── backend/
│   └── src/
│       ├── main/
│       │   ├── java/com/example/ordermanagement/
│       │   │   ├── controller/ # REST API
│       │   │   ├── service/    # กฎและการคำนวณของระบบ
│       │   │   ├── repository/ # ติดต่อฐานข้อมูล
│       │   │   └── model/      # Order และ OrderItem
│       │   └── resources/
│       │       └── application.properties
│       └── test/               # การทดสอบ Backend
├── docs/                       # เอกสารเพิ่มเติม
├── compose.yaml                # การรันระบบและ volume ฐานข้อมูล
├── Dockerfile                  # ขั้นตอนสร้าง Docker image
├── pom.xml                     # Dependencies และการตั้งค่า Maven
└── README.md
```

ข้อมูล H2 จริงไม่ได้เก็บในโฟลเดอร์ `backend` แต่เก็บใน Docker volume ชื่อ `order_data`

## เริ่มใช้งานด้วย Docker

สิ่งที่ต้องมี:

- Docker Desktop และ Docker Engine ที่พร้อมใช้งาน
- อินเทอร์เน็ตสำหรับดาวน์โหลด image และ dependencies ในการ build ครั้งแรก

เปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน:

```bash
docker compose up --build -d
```

เมื่อคอนเทนเนอร์เริ่มสำเร็จ เปิด:

- หน้าเว็บ: <http://localhost:8082>
- ข้อมูลคำสั่งซื้อแบบ JSON: <http://localhost:8082/orders>
- H2 Console: <http://localhost:8082/h2-console>

ตรวจสถานะและ log:

```bash
docker compose ps
docker compose logs -f
```

กด `Ctrl+C` เพื่อหยุดดู log โดยระบบยังทำงานต่อในพื้นหลัง

## วิธีใช้งานหน้าเว็บ

1. กรอกเลขที่คำสั่งซื้อและชื่อลูกค้า ซึ่งเป็นข้อมูลที่จำเป็น
2. กรอกเบอร์โทรและที่อยู่ตามต้องการ
3. กรอกชื่อสินค้า ราคาต่อหน่วย และจำนวน แล้วกด **+ เพิ่ม**
4. เพิ่มสินค้าอื่นต่อได้ หรือกด **แก้ไข/ลบ** ก่อนบันทึก
5. ตรวจยอดรวมแล้วกด **บันทึกคำสั่งซื้อ**
6. ดูข้อมูลที่บันทึกแล้วในส่วน **คำสั่งซื้อย้อนหลัง**

ข้อมูลที่กรอกแต่ยังไม่ได้กดบันทึกจะหายเมื่อรีเฟรชหน้าเว็บ

## REST API

Base URL เมื่อรันด้วย Docker: `http://localhost:8082/orders`

| Method | Endpoint | การทำงาน |
|---|---|---|
| `GET` | `/orders` | ดูคำสั่งซื้อทั้งหมด |
| `GET` | `/orders/{id}` | ดูคำสั่งซื้อตาม ID |
| `POST` | `/orders` | สร้างคำสั่งซื้อ |
| `PUT` | `/orders/{id}` | แก้ไขคำสั่งซื้อ |
| `DELETE` | `/orders/{id}` | ลบคำสั่งซื้อ |

ตัวอย่างข้อมูลสำหรับสร้างคำสั่งซื้อ:

```json
{
  "orderNumber": "ORD-001",
  "customerName": "ลูกค้าตัวอย่าง",
  "phone": "0800000000",
  "address": "นครศรีธรรมราช",
  "items": [
    {
      "productName": "สินค้าตัวอย่าง",
      "price": 150,
      "quantity": 2
    }
  ]
}
```

Backend จะคำนวณ `subTotal` และ `totalAmount` ก่อนบันทึก

## ดูฐานข้อมูล H2

เปิด <http://localhost:8082/h2-console> แล้วกรอก:

| ช่อง | ค่า |
|---|---|
| Driver Class | `org.h2.Driver` |
| JDBC URL | `jdbc:h2:file:/data/orders` |
| User Name | `user` |
| Password | เว้นว่าง |

คำสั่งดูข้อมูล:

```sql
SELECT * FROM ORDERS;
SELECT * FROM ORDER_ITEMS;
```

H2 Console สามารถแก้ไขและลบข้อมูลได้ จึงควรใช้สำหรับการพัฒนาและใช้งานอย่างระมัดระวัง พอร์ตของระบบถูกผูกกับ `127.0.0.1` เพื่อให้เข้าถึงจากเครื่องนี้เท่านั้น

หากมี Docker volume เดิมที่สร้างด้วยชื่อผู้ใช้อื่น ต้องย้ายผู้ใช้ในฐานข้อมูลหรือสร้าง volume ใหม่ก่อนใช้ค่า `user` การสร้าง volume ใหม่ด้วย `docker compose down -v` จะลบข้อมูลเดิมทั้งหมด

## คำสั่งที่ใช้บ่อย

```bash
# เริ่มระบบที่เคย build แล้ว
docker compose up -d

# build ใหม่หลังแก้โค้ด
docker compose up --build -d

# หยุดและนำคอนเทนเนอร์ออก โดยเก็บข้อมูลไว้
docker compose down

# ดูสถานะ
docker compose ps

# ดู log
docker compose logs -f
```

อย่าใช้ `docker compose down -v` หากต้องการเก็บข้อมูล เพราะ `-v` จะลบ volume ฐานข้อมูลด้วย

## รัน Backend โดยไม่ใช้ Docker

ต้องมี Java 17 ขึ้นไป จากโฟลเดอร์โปรเจกต์ให้รัน:

```powershell
.\mvnw.cmd spring-boot:run
```

บน macOS/Linux:

```bash
./mvnw spring-boot:run
```

โหมดนี้ใช้ค่าจาก `backend/src/main/resources/application.properties` และเปิดที่ <http://localhost:8081> ฐานข้อมูลเป็น H2 แบบ in-memory จึงเป็นคนละชุดกับ Docker และข้อมูลจะหายเมื่อปิดแอป

## การทดสอบ

```powershell
.\mvnw.cmd test
```

บน macOS/Linux ใช้ `./mvnw test` การรันครั้งแรกต้องเชื่อมต่ออินเทอร์เน็ตเพื่อดาวน์โหลด dependencies

## แก้ปัญหาเบื้องต้น

- **Docker เชื่อมต่อไม่ได้:** เปิด Docker Desktop และรอจน Engine พร้อม แล้วลองคำสั่งอีกครั้ง
- **เปิดเว็บไม่ได้:** ตรวจ `docker compose ps` และ `docker compose logs -f` รวมถึงตรวจว่าพอร์ต `8082` ไม่ถูกโปรแกรมอื่นใช้
- **แก้โค้ดแล้วหน้าไม่เปลี่ยน:** รัน `docker compose up --build -d` แล้วรีเฟรชหน้าเว็บ
- **บันทึกไม่ได้:** ตรวจเลขที่คำสั่งซื้อ ชื่อลูกค้า ชื่อสินค้า ราคา และจำนวน แล้วดู log ของ Backend
- **H2 Console เข้าไม่ได้:** ตรวจ JDBC URL, username และตรวจว่าคอนเทนเนอร์กำลังทำงาน

## เอกสารเพิ่มเติม

- [วิธีใช้งาน Docker](docs/DOCKER.md)
- [เอกสารอ้างอิง Spring Boot และ Maven](docs/HELP.md)

## ข้อจำกัดปัจจุบัน

- H2 เหมาะกับการทดลองหรือใช้งานบนเครื่องเดียว
- ระบบยังไม่มีการเข้าสู่ระบบและการกำหนดสิทธิ์ผู้ใช้
- ควรใช้ฐานข้อมูลภายนอกและระบบสำรองข้อมูลก่อนนำไปใช้จริงหลายคน
