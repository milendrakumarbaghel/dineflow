package com.dineflow.order.entity;

import com.dineflow.menu.entity.ModifierOption;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_item_modifiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemModifier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modifier_option_id")
    private ModifierOption modifierOption;

    @Column(name = "option_name_snapshot", nullable = false, length = 100)
    private String optionNameSnapshot;

    @Column(name = "price_delta_snapshot", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal priceDeltaSnapshot = BigDecimal.ZERO;
}
