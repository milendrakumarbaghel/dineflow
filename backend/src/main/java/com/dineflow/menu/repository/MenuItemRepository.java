package com.dineflow.menu.repository;

import com.dineflow.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(Long restaurantId);
    List<MenuItem> findByRestaurantSlug(String slug);
    List<MenuItem> findByRestaurantIdAndCategoryId(Long restaurantId, Long categoryId);
}
