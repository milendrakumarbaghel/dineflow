package com.dineflow.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false, unique = true)
    private Restaurant restaurant;

    @Column(name = "allow_qr_ordering", nullable = false)
    @Builder.Default
    private boolean allowQrOrdering = true;

    @Column(name = "allow_counter_pickup", nullable = false)
    @Builder.Default
    private boolean allowCounterPickup = true;

    @Column(name = "require_staff_acceptance", nullable = false)
    @Builder.Default
    private boolean requireStaffAcceptance = true;

    @Column(name = "allow_order_cancellation", nullable = false)
    @Builder.Default
    private boolean allowOrderCancellation = false;

    @Column(name = "no_show_grace_minutes", nullable = false)
    @Builder.Default
    private int noShowGraceMinutes = 5;

    @Column(name = "seating_strategy", nullable = false, length = 50)
    @Builder.Default
    private String seatingStrategy = "FIFO_CAPACITY_FIT";

    @Column(name = "advance_order_policy", nullable = false, length = 50)
    @Builder.Default
    private String advanceOrderPolicy = "AFTER_SEATING_DEFAULT";

    @Column(name = "default_tax_rate", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal defaultTaxRate = new BigDecimal("5.00");

    @Column(name = "service_charge_rate", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal serviceChargeRate = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
