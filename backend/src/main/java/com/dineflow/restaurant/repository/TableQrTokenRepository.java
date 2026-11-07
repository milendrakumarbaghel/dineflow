package com.dineflow.restaurant.repository;

import com.dineflow.restaurant.entity.TableQrToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TableQrTokenRepository extends JpaRepository<TableQrToken, Long> {
    Optional<TableQrToken> findByTokenValueAndRevokedFalse(String tokenValue);
    Optional<TableQrToken> findByTableIdAndRevokedFalse(Long tableId);
}
