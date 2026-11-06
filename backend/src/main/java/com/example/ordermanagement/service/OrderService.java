package com.example.ordermanagement.service;

import com.example.ordermanagement.model.Order;
import com.example.ordermanagement.model.OrderItem;
import com.example.ordermanagement.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // CREATE
    public Order createOrder(Order order) {

        double totalAmount = 0;

        for (OrderItem item : order.getItems()) {

            double subTotal = item.getPrice() * item.getQuantity();
            item.setSubTotal(subTotal);

            totalAmount += subTotal;
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    // READ
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // UPDATE
    public Order updateOrder(Long id, Order updatedOrder) {

        return orderRepository.findById(id).map(order -> {

            order.setOrderNumber(updatedOrder.getOrderNumber());
            order.setCustomerName(updatedOrder.getCustomerName());
            order.setPhone(updatedOrder.getPhone());
            order.setAddress(updatedOrder.getAddress());
            order.setItems(updatedOrder.getItems());

            double totalAmount = 0;

            for (OrderItem item : order.getItems()) {

                double subTotal = item.getPrice() * item.getQuantity();
                item.setSubTotal(subTotal);

                totalAmount += subTotal;
            }

            order.setTotalAmount(totalAmount);

            return orderRepository.save(order);

        }).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // DELETE
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // GET ALL ORDERS
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
