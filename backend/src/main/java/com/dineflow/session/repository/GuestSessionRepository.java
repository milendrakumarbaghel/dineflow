package com.dineflow.session.repository;

import com.dineflow.session.entity.GuestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestSessionRepository extends JpaRepository<GuestSession, Long> {
    List<GuestSession> findByTableSessionId(Long tableSessionId);
}
