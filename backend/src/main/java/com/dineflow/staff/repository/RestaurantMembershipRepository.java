package com.dineflow.staff.repository;

import com.dineflow.staff.entity.RestaurantMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantMembershipRepository extends JpaRepository<RestaurantMembership, Long> {
    List<RestaurantMembership> findByRestaurantId(Long restaurantId);
    Optional<RestaurantMembership> findByUserIdAndRestaurantId(Long userId, Long restaurantId);
    Optional<RestaurantMembership> findByUserId(Long userId);
    List<RestaurantMembership> findByRestaurantSlug(String slug);
}
