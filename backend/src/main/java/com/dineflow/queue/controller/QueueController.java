package com.dineflow.queue.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.queue.dto.AdvanceOrderRequest;
import com.dineflow.queue.dto.AssignTableRequest;
import com.dineflow.queue.dto.QueueJoinRequest;
import com.dineflow.queue.dto.QueueTicketDto;
import com.dineflow.queue.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @PostMapping("/public/queue")
    public ResponseEntity<ApiResponse<QueueTicketDto>> joinQueue(@Valid @RequestBody QueueJoinRequest request) {
        QueueTicketDto ticket = queueService.joinQueue(request);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Joined queue successfully"));
    }

    @GetMapping("/public/queue/{ticketToken}")
    public ResponseEntity<ApiResponse<QueueTicketDto>> getQueueTicket(@PathVariable String ticketToken) {
        QueueTicketDto ticket = queueService.getTicketByToken(ticketToken);
        return ResponseEntity.ok(ApiResponse.ok(ticket));
    }

    @PostMapping("/public/queue/{ticketToken}/cancel")
    public ResponseEntity<ApiResponse<QueueTicketDto>> cancelQueue(@PathVariable String ticketToken) {
        QueueTicketDto cancelled = queueService.cancelTicket(ticketToken);
        return ResponseEntity.ok(ApiResponse.ok(cancelled, "Queue ticket cancelled"));
    }

    @PostMapping("/public/queue/{ticketToken}/advance-order")
    public ResponseEntity<ApiResponse<OrderResponseDto>> placeAdvanceOrder(
            @PathVariable String ticketToken,
            @Valid @RequestBody AdvanceOrderRequest request) {
        OrderResponseDto order = queueService.placeAdvanceOrder(ticketToken, request);
        return ResponseEntity.ok(ApiResponse.ok(order, "Advance order placed successfully"));
    }

    @GetMapping("/staff/queue")
    public ResponseEntity<ApiResponse<List<QueueTicketDto>>> getStaffQueue(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<QueueTicketDto> queue = queueService.getStaffQueue(slug);
        return ResponseEntity.ok(ApiResponse.ok(queue));
    }

    @PostMapping("/staff/queue/{ticketId}/assign-table")
    public ResponseEntity<ApiResponse<QueueTicketDto>> assignTable(
            @PathVariable Long ticketId,
            @RequestBody(required = false) AssignTableRequest request) {
        Long tableId = request != null ? request.getTableId() : null;
        String tableNumber = request != null ? request.getTableNumber() : null;
        QueueTicketDto assigned = queueService.assignTable(ticketId, tableId, tableNumber);
        return ResponseEntity.ok(ApiResponse.ok(assigned, "Table assigned successfully"));
    }

    @PostMapping("/staff/queue/{ticketId}/mark-seated")
    public ResponseEntity<ApiResponse<QueueTicketDto>> markSeated(@PathVariable Long ticketId) {
        QueueTicketDto seated = queueService.markSeated(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(seated, "Guest marked as seated"));
    }

    @PostMapping("/staff/queue/{ticketId}/mark-no-show")
    public ResponseEntity<ApiResponse<QueueTicketDto>> markNoShow(@PathVariable Long ticketId) {
        QueueTicketDto ticket = queueService.markNoShow(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(ticket, "Guest marked as no-show"));
    }
}
