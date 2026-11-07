package com.dineflow.menu.repository;

import com.dineflow.menu.entity.ModifierGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModifierGroupRepository extends JpaRepository<ModifierGroup, Long> {
    List<ModifierGroup> findByRestaurantId(Long restaurantId);
}
