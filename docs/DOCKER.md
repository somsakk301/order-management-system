# การใช้งานด้วย Docker

เอกสารฉบับย่อสำหรับ build และควบคุม Order Management System รายละเอียดทั้งหมดอยู่ที่ [README หลัก](../README.md)

## เริ่มระบบ

เปิด Docker Desktop และรอให้ Engine พร้อม จากนั้นเปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน:

```bash
docker compose up --build -d
```

เปิดหน้าเว็บที่ <http://localhost:8082>

## คำสั่งสำคัญ

```bash
docker compose ps          # ดูสถานะ
docker compose logs -f     # ดู log
docker compose up -d       # เริ่มระบบเดิม
docker compose down        # หยุดระบบและเก็บข้อมูลไว้
```

หลังแก้โค้ดให้รัน `docker compose up --build -d` เพื่อสร้าง image ใหม่

## การเก็บข้อมูล

ฐานข้อมูล H2 เก็บอยู่ใน Docker volume ชื่อ `order_data` ข้อมูลยังอยู่หลัง `docker compose down` และการสร้างคอนเทนเนอร์ใหม่

อย่าใช้ `docker compose down -v` หากต้องการเก็บข้อมูล เพราะตัวเลือก `-v` จะลบ volume ด้วย

## URL ที่ใช้

- หน้าเว็บ: <http://localhost:8082>
- REST API: <http://localhost:8082/orders>
- H2 Console: <http://localhost:8082/h2-console>

H2 Console เชื่อมต่อด้วย JDBC URL `jdbc:h2:file:/data/orders`, username `user` และไม่ต้องใส่รหัสผ่าน

หาก Docker volume เดิมสร้างด้วยชื่อผู้ใช้อื่น ต้องย้ายผู้ใช้ในฐานข้อมูลหรือสร้าง volume ใหม่ก่อนใช้ค่า `user` การใช้ `docker compose down -v` จะลบข้อมูลเดิมทั้งหมด
