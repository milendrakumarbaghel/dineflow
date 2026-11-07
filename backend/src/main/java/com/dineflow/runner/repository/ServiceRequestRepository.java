package com.dineflow.runner.repository;

import com.dineflow.runner.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<ServiceRequest> findByRestaurantIdAndStatusOrderByCreatedAtDesc(Long restaurantId, String status);
    List<ServiceRequest> findByRestaurantSlugAndStatusOrderByCreatedAtDesc(String slug, String status);
}
