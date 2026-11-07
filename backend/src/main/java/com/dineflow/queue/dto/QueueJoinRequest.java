package com.dineflow.queue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class QueueJoinRequest {
    private String restaurantSlug = "ember-and-olive";
    @NotBlank
    private String customerName;
    private String customerPhone;
    @Positive
    private int partySize = 2;
    private String seatingPreference = "ANY"; // ANY, INDOOR, OUTDOOR, ACCESSIBLE
}
