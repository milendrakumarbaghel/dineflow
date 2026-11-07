package com.dineflow.billing.repository;

import com.dineflow.billing.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByTableSessionId(Long tableSessionId);
    Optional<Bill> findByBillNumber(String billNumber);
    List<Bill> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}
