package com.dineflow.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiningTableDto {
    private Long id;
    private String tableNumber;
    private int seatsCapacity;
    private String status; // AVAILABLE, OCCUPIED, CLEANING, RESERVED, INACTIVE
    private String currentGuestNote;
    private String qrToken;
    private String qrCodeDataUrl;
    private String areaName;
}
