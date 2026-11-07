package com.dineflow.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private String destination;
    private String orderType;
    private String customerName;
    private String customerPhone;
    private String status; // PLACED, ACCEPTED, PREPARING, READY, SERVED, COMPLETED, CANCELLED
    private int statusIndex; // 0=Placed, 1=Accepted, 2=Preparing, 3=Ready, 4=Served
    private boolean holdForSeating;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private String paymentStatus;
    private String paymentMode;
    private String age;
    private List<OrderItemResponseDto> items;
    private String itemsSummary;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private Long id;
        private Long menuItemId;
        private String name;
        private BigDecimal unitPrice;
        private int quantity;
        private String spiceLevel;
        private String instructions;
        private BigDecimal totalPrice;
    }
}
