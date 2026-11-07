package com.dineflow.session.repository;

import com.dineflow.session.entity.TableSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableSessionRepository extends JpaRepository<TableSession, Long> {
    Optional<TableSession> findByTableIdAndStatus(Long tableId, String status);
    Optional<TableSession> findBySessionCode(String sessionCode);
    List<TableSession> findByRestaurantIdAndStatus(Long restaurantId, String status);
}
