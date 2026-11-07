package com.dineflow.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dining_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiningTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private DiningArea area;

    @Column(name = "table_number", nullable = false, length = 30)
    private String tableNumber;

    @Column(name = "seats_capacity", nullable = false)
    @Builder.Default
    private int seatsCapacity = 4;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, OCCUPIED, CLEANING, RESERVED, INACTIVE

    @Column(name = "current_guest_note", length = 100)
    private String currentGuestNote;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
