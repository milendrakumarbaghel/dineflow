package com.dineflow.staff.repository;

import com.dineflow.staff.entity.StaffInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffInvitationRepository extends JpaRepository<StaffInvitation, Long> {
    List<StaffInvitation> findByRestaurantId(Long restaurantId);
    Optional<StaffInvitation> findByInvitationToken(String token);
}
