package com.dineflow.billing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bill_splits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillSplit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @Column(name = "split_number", nullable = false)
    private int splitNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "UNPAID"; // UNPAID, PAID

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;
}
