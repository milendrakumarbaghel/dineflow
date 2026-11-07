package com.dineflow.restaurant.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.restaurant.dto.QrContextResponse;
import com.dineflow.restaurant.dto.RestaurantDto;
import com.dineflow.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/public/restaurants/{slug}")
    public ResponseEntity<ApiResponse<RestaurantDto>> getPublicRestaurant(@PathVariable String slug) {
        RestaurantDto dto = restaurantService.getRestaurantDtoBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/public/restaurants/{slug}/qr/{token}/context")
    public ResponseEntity<ApiResponse<QrContextResponse>> getQrContext(
            @PathVariable String slug,
            @PathVariable String token) {
        QrContextResponse response = restaurantService.resolveQrContext(slug, token);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/admin/settings")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<RestaurantDto>> getAdminSettings(@AuthenticationPrincipal UserPrincipal principal) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : 1L;
        RestaurantDto dto = restaurantService.getRestaurantDtoBySlug("ember-and-olive");
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping("/admin/settings")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<RestaurantDto>> updateAdminSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody RestaurantDto dto) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : 1L;
        RestaurantDto updated = restaurantService.updateSettings(restId, dto);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Settings saved successfully"));
    }
}
