package com.dineflow.queue.dto;

import com.dineflow.order.dto.OrderResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueTicketDto {
    private Long id;
    private String ticketToken; // e.g. Q-018
    private String customerName;
    private String customerPhone;
    private int partySize;
    private String seatingPreference;
    private String status; // WAITING, NOTIFIED, SEATED, CANCELLED, NO_SHOW, EXPIRED
    private int estimatedWaitMinutes;
    private int positionAhead;
    private Long assignedTableId;
    private String assignedTableNumber;
    private String advanceOrderMode; // after-seat, counter-now
    private OrderResponseDto advanceOrder;
    private LocalDateTime createdAt;
    private String waitDurationText;
}
