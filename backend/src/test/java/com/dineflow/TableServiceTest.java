package com.dineflow;

import com.dineflow.common.exception.ConflictException;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.restaurant.dto.DiningTableDto;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.repository.TableQrTokenRepository;
import com.dineflow.restaurant.service.TableService;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private TableQrTokenRepository qrTokenRepository;
    @Mock
    private TableSessionRepository sessionRepository;
    @Mock
    private WebSocketEventPublisher eventPublisher;

    @InjectMocks
    private TableService tableService;

    private Restaurant restaurant;
    private DiningTable table;

    @BeforeEach
    void setUp() {
        restaurant = Restaurant.builder().id(1L).slug("ember-and-olive").build();
        table = DiningTable.builder()
                .id(1L)
                .restaurant(restaurant)
                .tableNumber("T01")
                .seatsCapacity(2)
                .status("OCCUPIED")
                .build();
    }

    @Test
    void testCannotMarkAvailableWhileActiveSessionExists() {
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(sessionRepository.findByTableIdAndStatus(1L, "ACTIVE")).thenReturn(
                Optional.of(TableSession.builder().id(5L).sessionCode("SES-1234").build())
        );

        assertThrows(ConflictException.class, () -> tableService.updateStatus(1L, "AVAILABLE", null));
    }

    @Test
    void testStartSessionAndCloseSessionLifecycle() {
        table.setStatus("AVAILABLE");
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(sessionRepository.findByTableIdAndStatus(1L, "ACTIVE")).thenReturn(Optional.empty());
        when(sessionRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(tableRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        TableSession session = tableService.startSession(1L, "Priya", 2);

        assertNotNull(session);
        assertEquals("ACTIVE", session.getStatus());
        assertEquals("OCCUPIED", table.getStatus());

        // Now test close session
        when(sessionRepository.findByTableIdAndStatus(1L, "ACTIVE")).thenReturn(Optional.of(session));
        DiningTableDto closedResult = tableService.closeSession(1L);

        assertEquals("CLEANING", closedResult.getStatus());
        assertEquals("CLOSED", session.getStatus());
    }
}
