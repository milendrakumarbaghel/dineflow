package com.dineflow.menu.entity;

import com.dineflow.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modifier_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModifierGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private boolean required = false;

    @Column(name = "min_selection", nullable = false)
    @Builder.Default
    private int minSelection = 0;

    @Column(name = "max_selection", nullable = false)
    @Builder.Default
    private int maxSelection = 1;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ModifierOption> options = new ArrayList<>();
}
