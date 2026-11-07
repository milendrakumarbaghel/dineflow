package com.dineflow.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMemberDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String position;
    private String role;
    private String status;
    private String phone;
}
