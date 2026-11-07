package com.dineflow.runner.controller;

import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.dto.OrderStatusUpdateDto;
import com.dineflow.order.service.OrderService;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.runner.entity.ServiceRequest;
import com.dineflow.runner.repository.ServiceRequestRepository;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RunnerController {

    private final OrderService orderService;
    private final ServiceRequestRepository requestRepository;
    private final RestaurantRepository restaurantRepository;
    private final DiningTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final WebSocketEventPublisher eventPublisher;

    @GetMapping("/staff/runner/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getReadyOrders(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<OrderResponseDto> readyOrders = orderService.getOrdersByRestaurantSlug(slug)
                .stream()
                .filter(o -> "READY".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(readyOrders));
    }

    @PostMapping("/staff/runner/orders/{orderId}/serve")
    public ResponseEntity<ApiResponse<OrderResponseDto>> confirmServed(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderStatusUpdateDto dto = new OrderStatusUpdateDto();
        dto.setStatus("SERVED");
        dto.setNote("Delivered to destination table");
        String changedBy = principal != null ? principal.getFullName() : "Waiter / Runner";
        OrderResponseDto updated = orderService.updateOrderStatus(orderId, dto, changedBy);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order confirmed served"));
    }

    @GetMapping("/staff/runner/requests")
    public ResponseEntity<ApiResponse<List<ServiceRequest>>> getServiceRequests(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<ServiceRequest> requests = requestRepository.findByRestaurantSlugAndStatusOrderByCreatedAtDesc(slug, "PENDING");
        return ResponseEntity.ok(ApiResponse.ok(requests));
    }

    @PostMapping("/staff/runner/requests/{requestId}/resolve")
    public ResponseEntity<ApiResponse<ServiceRequest>> resolveRequest(@PathVariable Long requestId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        req.setStatus("RESOLVED");
        req.setResolvedAt(LocalDateTime.now());
        ServiceRequest saved = requestRepository.save(req);
        eventPublisher.publishServiceRequest(saved.getRestaurant().getId(), saved);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Service request marked handled"));
    }

    @PostMapping("/public/service-requests")
    public ResponseEntity<ApiResponse<ServiceRequest>> createPublicServiceRequest(@RequestBody Map<String, String> body) {
        String slug = body.getOrDefault("restaurantSlug", "ember-and-olive");
        String tableNumber = body.getOrDefault("tableNumber", "T04");
        String requestType = body.getOrDefault("requestType", "CALL_WAITER");

        Restaurant restaurant = restaurantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        DiningTable table = tableRepository.findByRestaurantSlugAndTableNumber(slug, tableNumber).orElse(null);
        TableSession session = table != null ? sessionRepository.findByTableIdAndStatus(table.getId(), "ACTIVE").orElse(null) : null;

        ServiceRequest request = ServiceRequest.builder()
                .restaurant(restaurant)
                .table(table)
                .tableSession(session)
                .tableNumber(tableNumber)
                .requestType(requestType)
                .status("PENDING")
                .build();

        ServiceRequest saved = requestRepository.save(request);
        eventPublisher.publishServiceRequest(restaurant.getId(), saved);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Waiter has been notified. Someone will attend shortly."));
    }
}
