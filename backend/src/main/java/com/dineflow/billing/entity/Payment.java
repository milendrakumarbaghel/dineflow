package com.dineflow.billing.entity;

import com.dineflow.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 50)
    @Builder.Default
    private String paymentMethod = "UPI"; // UPI, CARD, CASH, RAZORPAY

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PAID"; // PAID, PENDING, FAILED, REFUNDED

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "collected_by", length = 100)
    private String collectedBy;

    @Column(name = "paid_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime paidAt = LocalDateTime.now();
}
