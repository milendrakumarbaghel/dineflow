package com.dineflow.menu.entity;

import com.dineflow.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 20)
    private String emoji;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(length = 50)
    private String tag;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(name = "prep_time_minutes", nullable = false)
    @Builder.Default
    private int prepTimeMinutes = 15;

    @Column(name = "spice_level", length = 20)
    @Builder.Default
    private String spiceLevel = "MILD";

    @Column(name = "is_vegetarian", nullable = false)
    @Builder.Default
    private boolean vegetarian = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "menu_item_modifier_groups",
            joinColumns = @JoinColumn(name = "menu_item_id"),
            inverseJoinColumns = @JoinColumn(name = "modifier_group_id")
    )
    @Builder.Default
    private Set<ModifierGroup> modifierGroups = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
