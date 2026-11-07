package com.dineflow.menu.repository;

import com.dineflow.menu.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByRestaurantIdAndActiveTrueOrderByDisplayOrderAsc(Long restaurantId);
    List<MenuCategory> findByRestaurantSlugAndActiveTrueOrderByDisplayOrderAsc(String slug);
    List<MenuCategory> findByRestaurantIdOrderByDisplayOrderAsc(Long restaurantId);
}
