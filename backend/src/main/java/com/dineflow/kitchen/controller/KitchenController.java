package com.dineflow.kitchen.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.dto.OrderStatusUpdateDto;
import com.dineflow.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/staff/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getKitchenOrders(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<OrderResponseDto> orders = orderService.getOrdersByRestaurantSlug(slug)
                .stream()
                .filter(o -> !o.isHoldForSeating())
                .filter(o -> !"SERVED".equalsIgnoreCase(o.getStatus()) &&
                             !"COMPLETED".equalsIgnoreCase(o.getStatus()) &&
                             !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponseDto>> acceptOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderStatusUpdateDto dto = new OrderStatusUpdateDto();
        dto.setStatus("ACCEPTED");
        dto.setNote("Kitchen accepted order");
        String changedBy = principal != null ? principal.getFullName() : "Kitchen Staff";
        OrderResponseDto updated = orderService.updateOrderStatus(orderId, dto, changedBy);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order accepted"));
    }

    @PostMapping("/orders/{orderId}/preparing")
    public ResponseEntity<ApiResponse<OrderResponseDto>> markPreparing(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderStatusUpdateDto dto = new OrderStatusUpdateDto();
        dto.setStatus("PREPARING");
        dto.setNote("Kitchen started preparation");
        String changedBy = principal != null ? principal.getFullName() : "Kitchen Staff";
        OrderResponseDto updated = orderService.updateOrderStatus(orderId, dto, changedBy);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order is preparing"));
    }

    @PostMapping("/orders/{orderId}/ready")
    public ResponseEntity<ApiResponse<OrderResponseDto>> markReady(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderStatusUpdateDto dto = new OrderStatusUpdateDto();
        dto.setStatus("READY");
        dto.setNote("Dish is plated and ready for service");
        String changedBy = principal != null ? principal.getFullName() : "Kitchen Staff";
        OrderResponseDto updated = orderService.updateOrderStatus(orderId, dto, changedBy);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order marked ready"));
    }
}
