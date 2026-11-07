package com.dineflow.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierGroupDto {
    private Long id;
    private String name;
    private boolean required;
    private int minSelection;
    private int maxSelection;
    private List<ModifierOptionDto> options;
}
