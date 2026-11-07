package com.dineflow.staff.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StaffInviteRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String role; // MANAGER, KITCHEN, WAITER, HOST, CASHIER
    private String position;
}
