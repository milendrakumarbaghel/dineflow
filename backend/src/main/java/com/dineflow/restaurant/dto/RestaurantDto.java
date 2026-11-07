package com.dineflow.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String currency;
    private String currencySymbol;
    private String timezone;
    private boolean active;
    private boolean allowQrOrdering;
    private boolean allowCounterPickup;
    private boolean requireStaffAcceptance;
    private boolean allowOrderCancellation;
    private int noShowGraceMinutes;
    private String seatingStrategy;
    private String advanceOrderPolicy;
    private BigDecimal defaultTaxRate;
    private BigDecimal serviceChargeRate;
}
