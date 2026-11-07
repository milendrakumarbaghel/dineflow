package com.dineflow.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TableCreateDto {
    @NotBlank
    private String tableNumber;
    @Positive
    private int seatsCapacity = 4;
    private String status = "AVAILABLE";
    private String currentGuestNote;
    private Long areaId;
}
