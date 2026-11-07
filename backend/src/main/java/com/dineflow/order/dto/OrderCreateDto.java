package com.dineflow.order.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateDto {
    private String restaurantSlug = "ember-and-olive";
    private String destination; // "T04", "PICKUP", etc.
    private String orderType = "DINE_IN"; // "DINE_IN", "COUNTER_PICKUP", "ADVANCE_ORDER"
    private String customerName;
    private String customerPhone;
    private String specialInstructions;
    private String paymentMode = "UPI"; // "UPI", "PAY_AT_TABLE", "CASH_AT_COUNTER", "CARD"
    private Long tableSessionId;
    private String queueTicketToken;

    @NotEmpty
    private List<OrderItemCreateDto> items;

    @Data
    public static class OrderItemCreateDto {
        private Long menuItemId;
        private int quantity = 1;
        private String spiceLevel;
        private String instructions;
        private List<Long> modifierOptionIds;
    }
}
