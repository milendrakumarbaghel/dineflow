package com.dineflow;

import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.order.service.OrderService;
import com.dineflow.queue.dto.QueueJoinRequest;
import com.dineflow.queue.dto.QueueTicketDto;
import com.dineflow.queue.entity.QueueTicket;
import com.dineflow.queue.repository.QueueTicketRepository;
import com.dineflow.queue.service.QueueService;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.service.TableService;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private QueueTicketRepository queueTicketRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private TableSessionRepository sessionRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderService orderService;
    @Mock
    private TableService tableService;
    @Mock
    private WebSocketEventPublisher eventPublisher;

    @InjectMocks
    private QueueService queueService;

    private Restaurant restaurant;

    @BeforeEach
    void setUp() {
        restaurant = Restaurant.builder().id(1L).slug("ember-and-olive").name("Ember & Olive").build();
    }

    @Test
    void testJoinQueueIssuesTokenAndEstimatesWait() {
        when(restaurantRepository.findBySlug("ember-and-olive")).thenReturn(Optional.of(restaurant));
        when(queueTicketRepository.countByRestaurantIdAndStatus(1L, "WAITING")).thenReturn(3L);
        when(queueTicketRepository.count()).thenReturn(3L);
        when(queueTicketRepository.save(any())).thenAnswer(invocation -> {
            QueueTicket t = invocation.getArgument(0);
            t.setId(10L);
            t.setCreatedAt(LocalDateTime.now());
            return t;
        });

        QueueJoinRequest request = new QueueJoinRequest();
        request.setRestaurantSlug("ember-and-olive");
        request.setCustomerName("Aarav Sharma");
        request.setPartySize(3);

        QueueTicketDto result = queueService.joinQueue(request);

        assertNotNull(result);
        assertEquals("Q-023", result.getTicketToken());
        assertEquals(3, result.getPartySize());
        assertEquals("WAITING", result.getStatus());
        assertEquals(20, result.getEstimatedWaitMinutes()); // (3+1) * 5 = 20

        verify(eventPublisher, times(1)).publishQueueUpdate(eq(1L), any());
    }

    @Test
    void testAssignTableUpdatesStatusAndStartsSession() {
        QueueTicket ticket = QueueTicket.builder()
                .id(1L)
                .ticketToken("Q-018")
                .restaurant(restaurant)
                .customerName("Aarav Sharma")
                .partySize(3)
                .status("WAITING")
                .createdAt(LocalDateTime.now())
                .build();

        DiningTable table = DiningTable.builder()
                .id(3L)
                .restaurant(restaurant)
                .tableNumber("T03")
                .seatsCapacity(4)
                .status("AVAILABLE")
                .build();

        when(queueTicketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(tableRepository.findById(3L)).thenReturn(Optional.of(table));
        when(tableService.startSession(eq(3L), eq("Aarav Sharma"), eq(3)))
                .thenReturn(TableSession.builder().id(100L).sessionCode("SES-100").table(table).build());
        when(queueTicketRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        QueueTicketDto result = queueService.assignTable(1L, 3L, null);

        assertEquals("NOTIFIED", result.getStatus());
        assertEquals("T03", result.getAssignedTableNumber());
        verify(tableService, times(1)).startSession(3L, "Aarav Sharma", 3);
        verify(eventPublisher, times(1)).publishQueueUpdate(eq(1L), any());
    }
}
