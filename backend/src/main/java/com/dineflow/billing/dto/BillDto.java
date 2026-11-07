package com.dineflow.billing.dto;

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
public class BillDto {
    private Long id;
    private String billNumber;
    private Long tableSessionId;
    private String tableNumber;
    private String guestName;
    private int guestCount;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal serviceCharge;
    private BigDecimal discountAmount;
    private BigDecimal totalDue;
    private String status; // UNPAID, PARTIALLY_PAID, PAID
    private int splitCount;
    private BigDecimal shareAmount;
    private LocalDateTime sessionStartedAt;
    private List<BillItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillItemDto {
        private String itemName;
        private int quantity;
        private BigDecimal totalAmount;
    }
}
