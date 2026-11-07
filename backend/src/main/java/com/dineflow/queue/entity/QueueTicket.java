package com.dineflow.queue.entity;

import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "ticket_token", nullable = false, length = 50)
    private String ticketToken; // e.g. Q-018

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(name = "party_size", nullable = false)
    @Builder.Default
    private int partySize = 2;

    @Column(name = "seating_preference", length = 50)
    @Builder.Default
    private String seatingPreference = "ANY";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "WAITING"; // WAITING, NOTIFIED, SEATED, CANCELLED, NO_SHOW, EXPIRED

    @Column(name = "estimated_wait_minutes", nullable = false)
    @Builder.Default
    private int estimatedWaitMinutes = 15;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_table_id")
    private DiningTable assignedTable;

    @Column(name = "assigned_table_number", length = 30)
    private String assignedTableNumber;

    @Column(name = "advance_order_mode", length = 50)
    private String advanceOrderMode; // after-seat, counter-now

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @Column(name = "seated_at")
    private LocalDateTime seatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
