package com.dineflow.order.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.order.dto.OrderCreateDto;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.dto.OrderStatusUpdateDto;
import com.dineflow.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/public/orders")
    public ResponseEntity<ApiResponse<OrderResponseDto>> placeOrder(@Valid @RequestBody OrderCreateDto dto) {
        OrderResponseDto order = orderService.createOrder(dto);
        return ResponseEntity.ok(ApiResponse.ok(order, "Order placed successfully"));
    }

    @GetMapping("/public/orders/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderStatus(@PathVariable String orderNumber) {
        OrderResponseDto order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/public/orders/{orderNumber}/cancel")
    public ResponseEntity<ApiResponse<OrderResponseDto>> cancelOrder(
            @PathVariable String orderNumber,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Customer requested cancellation";
        OrderResponseDto cancelled = orderService.cancelOrder(orderNumber, reason);
        return ResponseEntity.ok(ApiResponse.ok(cancelled, "Order cancelled"));
    }

    @GetMapping("/staff/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAllOrders(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<OrderResponseDto> orders = orderService.getOrdersByRestaurantSlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/staff/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String changedBy = principal != null ? principal.getFullName() + " (" + principal.getRole() + ")" : "Staff";
        OrderResponseDto updated = orderService.updateOrderStatus(orderId, dto, changedBy);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order status updated"));
    }

    @GetMapping("/staff/sessions/{sessionId}/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getSessionOrders(@PathVariable Long sessionId) {
        List<OrderResponseDto> orders = orderService.getOrdersBySessionId(sessionId);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }
}
