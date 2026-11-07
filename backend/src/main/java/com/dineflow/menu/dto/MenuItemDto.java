package com.dineflow.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Long categoryId;
    private String emoji;
    private String imageUrl;
    private String tag;
    private boolean available;
    private int prepTimeMinutes;
    private String spiceLevel;
    private boolean vegetarian;
    private List<ModifierGroupDto> modifierGroups;
}
