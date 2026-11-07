package com.dineflow.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrContextResponse {
    private RestaurantDto restaurant;
    private DiningTableDto table;
    private Long activeSessionId;
    private String sessionCode;
    private boolean valid;
    private String message;
}
