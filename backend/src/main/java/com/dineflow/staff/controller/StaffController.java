package com.dineflow.staff.controller;

import com.dineflow.common.response.ApiResponse;
import com.dineflow.staff.dto.StaffInviteRequest;
import com.dineflow.staff.dto.StaffMemberDto;
import com.dineflow.staff.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<StaffMemberDto>>> getStaff(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug) {
        List<StaffMemberDto> members = staffService.getStaffMembers(slug);
        return ResponseEntity.ok(ApiResponse.ok(members));
    }

    @PostMapping("/invite")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<StaffMemberDto>> inviteStaff(
            @RequestParam(required = false, defaultValue = "ember-and-olive") String slug,
            @Valid @RequestBody StaffInviteRequest request) {
        StaffMemberDto invited = staffService.inviteStaff(slug, request);
        return ResponseEntity.ok(ApiResponse.ok(invited, "Invitation sent successfully"));
    }

    @PatchMapping("/{membershipId}/role")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<StaffMemberDto>> updateStaffRole(
            @PathVariable Long membershipId,
            @RequestBody Map<String, String> body) {
        String roleName = body.get("role");
        StaffMemberDto updated = staffService.updateRole(membershipId, roleName);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Role updated"));
    }
}
