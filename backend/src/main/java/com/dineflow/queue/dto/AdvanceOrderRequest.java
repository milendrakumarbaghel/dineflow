package com.dineflow.queue.dto;

import com.dineflow.order.dto.OrderCreateDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AdvanceOrderRequest {
    @NotBlank
    private String mode; // "after-seat" or "counter-now"
    @NotEmpty
    private List<OrderCreateDto.OrderItemCreateDto> items;
}
