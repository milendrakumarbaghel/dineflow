package com.dineflow.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardDto {
    private BigDecimal grossSales;
    private BigDecimal netSales;
    private BigDecimal avgOrderValue;
    private int totalOrders;
    private int avgPrepTimeMinutes;
    private int tableTurnoverMinutes;
    private int activeTables;
    private int totalTables;
    private int occupancyPercentage;
    private int queueLength;
    private int avgQueueWaitMinutes;
    private List<HourlySalesPoint> hourlySales;
    private List<PopularDishStat> popularDishes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HourlySalesPoint {
        private String hourLabel; // "12p", "1p", "2p", ...
        private int salesInThousands; // 28, 42, 30, ...
        private BigDecimal totalAmount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PopularDishStat {
        private String name;
        private String emoji;
        private int ordersCount;
        private int percentage;
    }
}
