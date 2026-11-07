package com.dineflow.restaurant.repository;

import com.dineflow.restaurant.entity.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {
    List<DiningTable> findByRestaurantIdOrderByTableNumberAsc(Long restaurantId);
    List<DiningTable> findByRestaurantSlugOrderByTableNumberAsc(String slug);
    Optional<DiningTable> findByRestaurantIdAndTableNumber(Long restaurantId, String tableNumber);
    Optional<DiningTable> findByRestaurantSlugAndTableNumber(String slug, String tableNumber);
}
