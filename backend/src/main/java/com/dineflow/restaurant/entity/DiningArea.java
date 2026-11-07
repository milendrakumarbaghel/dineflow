package com.dineflow.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dining_areas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiningArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
