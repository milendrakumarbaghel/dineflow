package com.dineflow.queue.repository;

import com.dineflow.queue.entity.QueueTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicket, Long> {
    List<QueueTicket> findByRestaurantIdOrderByCreatedAtAsc(Long restaurantId);
    List<QueueTicket> findByRestaurantSlugOrderByCreatedAtAsc(String slug);
    Optional<QueueTicket> findByTicketToken(String ticketToken);
    List<QueueTicket> findByRestaurantIdAndStatus(Long restaurantId, String status);
    List<QueueTicket> findByRestaurantIdAndStatusInOrderByCreatedAtAsc(Long restaurantId, List<String> statuses);
    long countByRestaurantIdAndStatus(Long restaurantId, String status);
}
