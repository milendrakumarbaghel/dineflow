package com.dineflow.queue.service;

import com.dineflow.common.exception.BadRequestException;
import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.order.dto.OrderCreateDto;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.entity.Order;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.order.service.OrderService;
import com.dineflow.queue.dto.AdvanceOrderRequest;
import com.dineflow.queue.dto.QueueJoinRequest;
import com.dineflow.queue.dto.QueueTicketDto;
import com.dineflow.queue.entity.QueueTicket;
import com.dineflow.queue.repository.QueueTicketRepository;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.service.TableService;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueService {

    private final QueueTicketRepository queueTicketRepository;
    private final RestaurantRepository restaurantRepository;
    private final DiningTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final TableService tableService;
    private final WebSocketEventPublisher eventPublisher;

    @Transactional
    public QueueTicketDto joinQueue(QueueJoinRequest request) {
        Restaurant restaurant = restaurantRepository.findBySlug(request.getRestaurantSlug())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + request.getRestaurantSlug()));

        long activeCount = queueTicketRepository.countByRestaurantIdAndStatus(restaurant.getId(), "WAITING");

        int nextNum = 20 + (int) queueTicketRepository.count();
        String token = "Q-0" + nextNum;

        int waitMins = Math.max(10, (int) (activeCount + 1) * 5);

        QueueTicket ticket = QueueTicket.builder()
                .restaurant(restaurant)
                .ticketToken(token)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .partySize(request.getPartySize())
                .seatingPreference(request.getSeatingPreference() != null ? request.getSeatingPreference() : "ANY")
                .status("WAITING")
                .estimatedWaitMinutes(waitMins)
                .build();

        QueueTicket saved = queueTicketRepository.save(ticket);
        QueueTicketDto dto = toDto(saved);

        eventPublisher.publishQueueUpdate(restaurant.getId(), dto);
        return dto;
    }

    public QueueTicketDto getTicketByToken(String ticketToken) {
        QueueTicket ticket = queueTicketRepository.findByTicketToken(ticketToken)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found: " + ticketToken));
        return toDto(ticket);
    }

    public List<QueueTicketDto> getStaffQueue(String slug) {
        return queueTicketRepository.findByRestaurantSlugOrderByCreatedAtAsc(slug)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QueueTicketDto assignTable(Long ticketId, Long tableId, String tableNumber) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found: " + ticketId));

        DiningTable table;
        if (tableId != null) {
            table = tableRepository.findById(tableId)
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableId));
        } else if (tableNumber != null) {
            table = tableRepository.findByRestaurantIdAndTableNumber(ticket.getRestaurant().getId(), tableNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableNumber));
        } else {
            // Find first available table that fits party size
            table = tableRepository.findByRestaurantIdOrderByTableNumberAsc(ticket.getRestaurant().getId())
                    .stream()
                    .filter(t -> "AVAILABLE".equalsIgnoreCase(t.getStatus()) && t.getSeatsCapacity() >= ticket.getPartySize())
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("No available table found that fits party size of " + ticket.getPartySize()));
        }

        // Set ticket status
        ticket.setStatus("NOTIFIED");
        ticket.setAssignedTable(table);
        ticket.setAssignedTableNumber(table.getTableNumber());
        ticket.setNotifiedAt(LocalDateTime.now());

        // Seat table & start session
        TableSession session = tableService.startSession(table.getId(), ticket.getCustomerName(), ticket.getPartySize());

        // Release any held advance order
        orderRepository.findAll().stream()
                .filter(o -> o.getQueueTicket() != null && o.getQueueTicket().getId().equals(ticket.getId()))
                .findFirst()
                .ifPresent(advanceOrder -> {
                    advanceOrder.setHoldForSeating(false);
                    advanceOrder.setDestination(table.getTableNumber());
                    advanceOrder.setTableSession(session);
                    orderRepository.save(advanceOrder);
                    eventPublisher.publishOrderUpdate(ticket.getRestaurant().getId(), orderService.toDto(advanceOrder));
                });

        QueueTicket saved = queueTicketRepository.save(ticket);
        QueueTicketDto result = toDto(saved);

        eventPublisher.publishQueueUpdate(ticket.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public QueueTicketDto markSeated(Long ticketId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        ticket.setStatus("SEATED");
        ticket.setSeatedAt(LocalDateTime.now());

        QueueTicket saved = queueTicketRepository.save(ticket);
        QueueTicketDto result = toDto(saved);

        eventPublisher.publishQueueUpdate(ticket.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public QueueTicketDto markNoShow(Long ticketId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        ticket.setStatus("NO_SHOW");
        ticket.setCancelledAt(LocalDateTime.now());

        QueueTicket saved = queueTicketRepository.save(ticket);
        QueueTicketDto result = toDto(saved);

        eventPublisher.publishQueueUpdate(ticket.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public QueueTicketDto cancelTicket(String ticketToken) {
        QueueTicket ticket = queueTicketRepository.findByTicketToken(ticketToken)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketToken));

        ticket.setStatus("CANCELLED");
        ticket.setCancelledAt(LocalDateTime.now());

        QueueTicket saved = queueTicketRepository.save(ticket);
        QueueTicketDto result = toDto(saved);

        eventPublisher.publishQueueUpdate(ticket.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public OrderResponseDto placeAdvanceOrder(String ticketToken, AdvanceOrderRequest request) {
        QueueTicket ticket = queueTicketRepository.findByTicketToken(ticketToken)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketToken));

        boolean isCounter = "counter-now".equalsIgnoreCase(request.getMode());

        OrderCreateDto orderDto = new OrderCreateDto();
        orderDto.setRestaurantSlug(ticket.getRestaurant().getSlug());
        orderDto.setOrderType("ADVANCE_ORDER");
        orderDto.setDestination(isCounter ? "PICKUP" : "WAITLIST");
        orderDto.setCustomerName(ticket.getCustomerName());
        orderDto.setCustomerPhone(ticket.getCustomerPhone());
        orderDto.setQueueTicketToken(ticketToken);
        orderDto.setSpecialInstructions(request.getMode());
        orderDto.setPaymentMode("UPI");
        orderDto.setItems(request.getItems());

        ticket.setAdvanceOrderMode(request.getMode());
        queueTicketRepository.save(ticket);

        return orderService.createOrder(orderDto);
    }

    public QueueTicketDto toDto(QueueTicket t) {
        // Calculate position ahead
        long ahead = queueTicketRepository.findByRestaurantIdAndStatus(t.getRestaurant().getId(), "WAITING")
                .stream()
                .filter(other -> other.getId() < t.getId())
                .count();

        Order advanceOrder = orderRepository.findAll().stream()
                .filter(o -> o.getQueueTicket() != null && o.getQueueTicket().getId().equals(t.getId()))
                .findFirst()
                .orElse(null);

        long mins = Duration.between(t.getCreatedAt(), LocalDateTime.now()).toMinutes();
        String waitText = mins <= 1 ? "Just joined" : mins + " min in line";

        return QueueTicketDto.builder()
                .id(t.getId())
                .ticketToken(t.getTicketToken())
                .customerName(t.getCustomerName())
                .customerPhone(t.getCustomerPhone())
                .partySize(t.getPartySize())
                .seatingPreference(t.getSeatingPreference())
                .status(t.getStatus())
                .estimatedWaitMinutes(t.getEstimatedWaitMinutes())
                .positionAhead((int) ahead)
                .assignedTableId(t.getAssignedTable() != null ? t.getAssignedTable().getId() : null)
                .assignedTableNumber(t.getAssignedTableNumber())
                .advanceOrderMode(t.getAdvanceOrderMode())
                .advanceOrder(advanceOrder != null ? orderService.toDto(advanceOrder) : null)
                .createdAt(t.getCreatedAt())
                .waitDurationText(waitText)
                .build();
    }
}
