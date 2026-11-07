package com.dineflow.session.controller;

import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.common.response.ApiResponse;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.service.OrderService;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.session.entity.GuestSession;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.GuestSessionRepository;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SessionController {

    private final TableSessionRepository sessionRepository;
    private final DiningTableRepository tableRepository;
    private final GuestSessionRepository guestSessionRepository;
    private final OrderService orderService;

    @GetMapping("/staff/tables/{tableId}/session")
    public ResponseEntity<ApiResponse<TableSessionDetailsDto>> getTableSessionDetails(
            @PathVariable Long tableId) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableId));

        TableSession session = sessionRepository.findByTableIdAndStatus(tableId, "ACTIVE")
                .orElse(null);

        if (session == null) {
            return ResponseEntity.ok(ApiResponse.ok(TableSessionDetailsDto.builder()
                    .tableNumber(table.getTableNumber())
                    .status("INACTIVE")
                    .guestCount(0)
                    .duration("0m")
                    .activeOrdersCount(0)
                    .orders(List.of())
                    .build()));
        }

        List<OrderResponseDto> orders = orderService.getOrdersBySessionId(session.getId());
        long mins = Duration.between(session.getStartedAt(), LocalDateTime.now()).toMinutes();

        TableSessionDetailsDto details = TableSessionDetailsDto.builder()
                .sessionId(session.getId())
                .sessionCode(session.getSessionCode())
                .tableNumber(table.getTableNumber())
                .guestName(session.getGuestName())
                .guestCount(session.getGuestCount())
                .status("ACTIVE")
                .duration(mins + "m")
                .activeOrdersCount((int) orders.stream().filter(o -> !"SERVED".equalsIgnoreCase(o.getStatus()) && !"COMPLETED".equalsIgnoreCase(o.getStatus())).count())
                .orders(orders)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(details));
    }

    @PostMapping("/public/guest-sessions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> joinGuestSession(@RequestBody Map<String, Object> body) {
        Long tableSessionId = body.get("tableSessionId") != null ? ((Number) body.get("tableSessionId")).longValue() : 1L;
        String guestName = (String) body.getOrDefault("guestName", "Guest");

        TableSession session = sessionRepository.findById(tableSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Table session not found: " + tableSessionId));

        String deviceToken = UUID.randomUUID().toString();
        GuestSession guest = GuestSession.builder()
                .tableSession(session)
                .guestDeviceToken(deviceToken)
                .guestName(guestName)
                .build();
        guestSessionRepository.save(guest);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "deviceToken", deviceToken,
                "sessionCode", session.getSessionCode(),
                "tableNumber", session.getTable().getTableNumber()
        ), "Joined table session successfully"));
    }

    @Data
    @Builder
    public static class TableSessionDetailsDto {
        private Long sessionId;
        private String sessionCode;
        private String tableNumber;
        private String guestName;
        private int guestCount;
        private String status;
        private String duration;
        private int activeOrdersCount;
        private List<OrderResponseDto> orders;
    }
}
