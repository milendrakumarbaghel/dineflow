package com.dineflow.analytics.controller;

import com.dineflow.analytics.dto.AnalyticsDashboardDto;
import com.dineflow.analytics.service.AnalyticsService;
import com.dineflow.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<AnalyticsDashboardDto>> getAnalytics(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug,
            @RequestParam(required = false, defaultValue = "today") String range) {
        AnalyticsDashboardDto stats = analyticsService.getDashboardStats(slug, range);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
