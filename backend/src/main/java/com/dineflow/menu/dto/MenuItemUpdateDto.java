package com.dineflow.menu.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemUpdateDto {
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private String emoji;
    private String imageUrl;
    private String tag;
    private Boolean available;
    private Integer prepTimeMinutes;
    private String spiceLevel;
    private Boolean vegetarian;
}
