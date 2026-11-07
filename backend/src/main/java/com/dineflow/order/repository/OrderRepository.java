package com.dineflow.order.repository;

import com.dineflow.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<Order> findByRestaurantSlugOrderByCreatedAtDesc(String slug);
    List<Order> findByTableSessionIdOrderByCreatedAtDesc(Long tableSessionId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByRestaurantIdAndStatus(Long restaurantId, String status);
    List<Order> findByRestaurantIdAndStatusInOrderByCreatedAtAsc(Long restaurantId, List<String> statuses);
}
