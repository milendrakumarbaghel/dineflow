package com.dineflow.billing.repository;

import com.dineflow.billing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBillId(Long billId);
    List<Payment> findByRestaurantIdOrderByPaidAtDesc(Long restaurantId);
}
