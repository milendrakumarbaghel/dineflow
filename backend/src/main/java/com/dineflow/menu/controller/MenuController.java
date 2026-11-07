package com.dineflow.menu.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.menu.dto.MenuCategoryDto;
import com.dineflow.menu.dto.MenuItemCreateDto;
import com.dineflow.menu.dto.MenuItemDto;
import com.dineflow.menu.dto.MenuItemUpdateDto;
import com.dineflow.menu.service.MenuService;
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
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/public/restaurants/{slug}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getPublicMenu(@PathVariable String slug) {
        List<MenuItemDto> items = menuService.getPublicMenu(slug);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/public/restaurants/{slug}/categories")
    public ResponseEntity<ApiResponse<List<MenuCategoryDto>>> getPublicCategories(@PathVariable String slug) {
        List<MenuCategoryDto> categories = menuService.getCategories(slug);
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/public/menu/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> getPublicMenuItem(@PathVariable Long id) {
        MenuItemDto item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @GetMapping("/admin/menu")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'KITCHEN')")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAdminMenu(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "1") Long restaurantId) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : restaurantId;
        List<MenuItemDto> items = menuService.getAdminMenu(restId);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @PostMapping("/admin/menu")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<MenuItemDto>> createMenuItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MenuItemCreateDto dto) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : 1L;
        MenuItemDto created = menuService.createMenuItem(restId, dto);
        return ResponseEntity.ok(ApiResponse.ok(created, "Menu item created successfully"));
    }

    @PutMapping("/admin/menu/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItemUpdateDto dto) {
        MenuItemDto updated = menuService.updateMenuItem(id, dto);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Menu item updated successfully"));
    }

    @PatchMapping("/admin/menu/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'KITCHEN')")
    public ResponseEntity<ApiResponse<MenuItemDto>> toggleAvailability(@PathVariable Long id) {
        MenuItemDto updated = menuService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Availability toggled"));
    }

    @PostMapping("/admin/categories")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<MenuCategoryDto>> createCategory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : 1L;
        String name = (String) body.get("name");
        int order = body.get("displayOrder") != null ? ((Number) body.get("displayOrder")).intValue() : 0;
        MenuCategoryDto created = menuService.createCategory(restId, name, order);
        return ResponseEntity.ok(ApiResponse.ok(created, "Category created"));
    }
}
