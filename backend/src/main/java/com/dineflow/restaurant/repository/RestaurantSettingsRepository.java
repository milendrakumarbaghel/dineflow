package com.dineflow.restaurant.repository;

import com.dineflow.restaurant.entity.RestaurantSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantSettingsRepository extends JpaRepository<RestaurantSettings, Long> {
    Optional<RestaurantSettings> findByRestaurantId(Long restaurantId);
    Optional<RestaurantSettings> findByRestaurantSlug(String slug);
}
