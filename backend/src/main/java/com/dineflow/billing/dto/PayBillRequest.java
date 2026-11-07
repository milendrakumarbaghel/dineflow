package com.dineflow.billing.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PayBillRequest {
    private int splitCount = 1;
    private BigDecimal amount;
    private String paymentMethod = "UPI"; // UPI, CARD, CASH, RAZORPAY
    private String transactionReference;
}
