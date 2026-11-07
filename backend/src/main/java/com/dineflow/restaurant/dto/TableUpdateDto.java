package com.dineflow.restaurant.dto;

import lombok.Data;

@Data
public class TableUpdateDto {
    private String tableNumber;
    private Integer seatsCapacity;
    private String status; // AVAILABLE, OCCUPIED, CLEANING, RESERVED, INACTIVE
    private String currentGuestNote;
}
