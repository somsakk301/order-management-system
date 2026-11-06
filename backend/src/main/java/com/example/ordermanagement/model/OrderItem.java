package com.example.ordermanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// ระบุว่า class นี้เป็นตารางในฐานข้อมูล
@Entity
// กำหนดชื่อตารางเป็น "order_items"
@Table(name = "order_items")
public class OrderItem {

    // Primary Key ของตาราง
    @Id
    // ให้ฐานข้อมูลสร้าง id อัตโนมัติ
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ชื่อสินค้า ห้ามเว้นว่าง
    @NotBlank(message = "Product name is required")
    private String productName;

    // ราคาสินค้า ห้ามเป็นค่าว่าง
    @NotNull(message = "Price is required")

    @Positive(message = "Price must be greater than 0")
    private Double price;

    // จำนวนสินค้า ห้ามเป็นค่าว่าง
    @NotNull(message = "Quantity is required")

    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;

    // ราคารวมของสินค้ารายการนี้ (price × quantity)
    private Double subTotal;

    // Getter & Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Double subTotal) {
        this.subTotal = subTotal;
    }
}
