package com.dineflow.billing.controller;

import com.dineflow.billing.dto.BillDto;
import com.dineflow.billing.dto.PayBillRequest;
import com.dineflow.billing.service.BillingService;
import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping("/public/table/{tableId}/bill")
    public ResponseEntity<ApiResponse<BillDto>> getPublicTableBill(
            @PathVariable String tableId,
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        BillDto bill = billingService.getBillForTable(tableId, slug);
        return ResponseEntity.ok(ApiResponse.ok(bill));
    }

    @PostMapping("/public/bills/{billId}/pay")
    public ResponseEntity<ApiResponse<BillDto>> payBillPublic(
            @PathVariable Long billId,
            @RequestBody PayBillRequest request) {
        BillDto paid = billingService.payBill(billId, request, "Guest (QR self-pay)");
        return ResponseEntity.ok(ApiResponse.ok(paid, "Payment recorded successfully"));
    }

    @GetMapping("/staff/tables/{tableId}/bill")
    public ResponseEntity<ApiResponse<BillDto>> getStaffTableBill(
            @PathVariable String tableId,
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        BillDto bill = billingService.getBillForTable(tableId, slug);
        return ResponseEntity.ok(ApiResponse.ok(bill));
    }

    @PostMapping("/staff/bills/{billId}/pay")
    public ResponseEntity<ApiResponse<BillDto>> payBillStaff(
            @PathVariable Long billId,
            @RequestBody PayBillRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String staffName = principal != null ? principal.getFullName() : "Cashier Desk";
        BillDto paid = billingService.payBill(billId, request, staffName);
        return ResponseEntity.ok(ApiResponse.ok(paid, "Payment recorded successfully"));
    }
}
