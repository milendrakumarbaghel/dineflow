package com.dineflow.restaurant.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.restaurant.dto.DiningTableDto;
import com.dineflow.restaurant.dto.TableCreateDto;
import com.dineflow.restaurant.dto.TableUpdateDto;
import com.dineflow.restaurant.service.TableService;
import com.dineflow.session.entity.TableSession;
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
public class TableController {

    private final TableService tableService;

    @GetMapping("/public/restaurants/{slug}/tables")
    public ResponseEntity<ApiResponse<List<DiningTableDto>>> getPublicTables(@PathVariable String slug) {
        List<DiningTableDto> tables = tableService.getTablesByRestaurantSlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(tables));
    }

    @GetMapping("/staff/tables")
    public ResponseEntity<ApiResponse<List<DiningTableDto>>> getStaffTables(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : null;
        List<DiningTableDto> tables = restId != null ?
                tableService.getTablesByRestaurantId(restId) :
                tableService.getTablesByRestaurantSlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(tables));
    }

    @PostMapping("/staff/tables")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'HOST')")
    public ResponseEntity<ApiResponse<DiningTableDto>> createTable(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TableCreateDto dto) {
        Long restId = principal != null && principal.getRestaurantId() != null ? principal.getRestaurantId() : 1L;
        DiningTableDto created = tableService.createTable(restId, dto);
        return ResponseEntity.ok(ApiResponse.ok(created, "Table created successfully"));
    }

    @PatchMapping("/staff/tables/{tableId}")
    public ResponseEntity<ApiResponse<DiningTableDto>> updateTable(
            @PathVariable Long tableId,
            @RequestBody TableUpdateDto dto) {
        DiningTableDto updated = tableService.updateTable(tableId, dto);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Table updated successfully"));
    }

    @PatchMapping("/staff/tables/{tableId}/status")
    public ResponseEntity<ApiResponse<DiningTableDto>> updateTableStatus(
            @PathVariable Long tableId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String note = body.get("note");
        DiningTableDto updated = tableService.updateStatus(tableId, status, note);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Table status updated"));
    }

    @PostMapping("/staff/tables/{tableId}/start-session")
    public ResponseEntity<ApiResponse<TableSession>> startSession(
            @PathVariable Long tableId,
            @RequestBody Map<String, Object> body) {
        String guestName = (String) body.getOrDefault("guestName", "Guests");
        int guestCount = body.get("guestCount") != null ? ((Number) body.get("guestCount")).intValue() : 2;
        TableSession session = tableService.startSession(tableId, guestName, guestCount);
        return ResponseEntity.ok(ApiResponse.ok(session, "Table session started"));
    }

    @PostMapping("/staff/tables/{tableId}/close-session")
    public ResponseEntity<ApiResponse<DiningTableDto>> closeSession(@PathVariable Long tableId) {
        DiningTableDto result = tableService.closeSession(tableId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Table session closed and table queued for cleaning"));
    }
}
