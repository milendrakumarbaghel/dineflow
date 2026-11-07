package com.dineflow.order.entity;

import com.dineflow.queue.entity.QueueTicket;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.session.entity.TableSession;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_session_id")
    private TableSession tableSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_ticket_id")
    private QueueTicket queueTicket;

    @Column(name = "order_number", nullable = false, length = 50)
    private String orderNumber;

    @Column(name = "order_type", nullable = false, length = 30)
    @Builder.Default
    private String orderType = "DINE_IN"; // DINE_IN, COUNTER_PICKUP, ADVANCE_ORDER

    @Column(nullable = false, length = 50)
    private String destination; // T01, T04, PICKUP, WAITLIST

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PLACED"; // PLACED, ACCEPTED, PREPARING, READY, SERVED, COMPLETED, CANCELLED

    @Column(name = "hold_for_seating", nullable = false)
    @Builder.Default
    private boolean holdForSeating = false;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "PENDING"; // PENDING, PROCESSING, PAID, FAILED, REFUNDED

    @Column(name = "payment_mode", length = 30)
    @Builder.Default
    private String paymentMode = "UPI"; // UPI, PAY_AT_TABLE, CASH_AT_COUNTER, CARD

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
