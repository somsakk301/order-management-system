package com.example.ordermanagement.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
// ชื่อตาราง"orders"
@Table(name = "orders")
public class Order {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ต้องกรอกเลขที่ออเดอร์
    @NotBlank(message = "Order number is required")
    private String orderNumber;

    // ต้องกรอกชื่อลูกค้า
    @NotBlank(message = "Customer name is required")
    private String customerName;

    // เบอร์โทรลูกค้า
    private String phone;

    // ที่อยู่ลูกค้า
    private String address;

    // ความสัมพันธ์ 1 Order มีหลาย OrderItem
    @OneToMany(cascade = CascadeType.ALL)
    // ใช้ order_id เป็น Foreign Key ในตาราง order_item
    @JoinColumn(name = "order_id")
    // ตรวจสอบ validation ของ OrderItem ด้วย
    @Valid
    private List<OrderItem> items;

    // ยอดรวมทั้งหมดของออเดอร์
    private Double totalAmount;

    // Getter & Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
