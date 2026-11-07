package com.dineflow.queue.dto;

import lombok.Data;

@Data
public class AssignTableRequest {
    private Long tableId;
    private String tableNumber;
}
