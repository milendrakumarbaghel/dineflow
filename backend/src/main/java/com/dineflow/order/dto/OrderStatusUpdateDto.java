package com.dineflow.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusUpdateDto {
    @NotBlank
    private String status; // PLACED, ACCEPTED, PREPARING, READY, SERVED, COMPLETED, CANCELLED
    private String note;
}
