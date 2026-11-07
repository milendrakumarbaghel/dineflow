package com.dineflow.order.service;

import com.dineflow.common.exception.BadRequestException;
import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.menu.entity.MenuItem;
import com.dineflow.menu.repository.MenuItemRepository;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.order.dto.OrderCreateDto;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.dto.OrderStatusUpdateDto;
import com.dineflow.order.entity.Order;
import com.dineflow.order.entity.OrderItem;
import com.dineflow.order.entity.OrderStatusHistory;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.queue.entity.QueueTicket;
import com.dineflow.queue.repository.QueueTicketRepository;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.entity.RestaurantSettings;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.repository.RestaurantSettingsRepository;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantSettingsRepository settingsRepository;
    private final DiningTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Transactional
    public OrderResponseDto createOrder(OrderCreateDto dto) {
        Restaurant restaurant = restaurantRepository.findBySlug(dto.getRestaurantSlug())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + dto.getRestaurantSlug()));

        RestaurantSettings settings = settingsRepository.findByRestaurantId(restaurant.getId()).orElse(null);
        BigDecimal taxRate = settings != null ? settings.getDefaultTaxRate() : new BigDecimal("5.00");

        String orderNumber = "TF-" + (1050 + (int) orderRepository.count());

        // Resolve Table Session if destination is a table
        TableSession tableSession = null;
        if (dto.getTableSessionId() != null) {
            tableSession = sessionRepository.findById(dto.getTableSessionId()).orElse(null);
        } else if (dto.getDestination() != null && dto.getDestination().startsWith("T")) {
            DiningTable table = tableRepository.findByRestaurantSlugAndTableNumber(dto.getRestaurantSlug(), dto.getDestination()).orElse(null);
            if (table != null) {
                tableSession = sessionRepository.findByTableIdAndStatus(table.getId(), "ACTIVE").orElse(null);
            }
        }

        // Resolve Queue Ticket if present
        QueueTicket queueTicket = null;
        if (dto.getQueueTicketToken() != null) {
            queueTicket = queueTicketRepository.findByTicketToken(dto.getQueueTicketToken()).orElse(null);
        }

        boolean holdForSeating = "ADVANCE_ORDER".equalsIgnoreCase(dto.getOrderType())
                && "after-seat".equalsIgnoreCase(dto.getSpecialInstructions());

        String destination = dto.getDestination() != null ? dto.getDestination() : "T04";
        if (holdForSeating) {
            destination = "WAITLIST";
        }

        Order order = Order.builder()
                .restaurant(restaurant)
                .tableSession(tableSession)
                .queueTicket(queueTicket)
                .orderNumber(orderNumber)
                .orderType(dto.getOrderType() != null ? dto.getOrderType() : "DINE_IN")
                .destination(destination)
                .customerName(dto.getCustomerName() != null ? dto.getCustomerName() : "Guest")
                .customerPhone(dto.getCustomerPhone())
                .status("PLACED")
                .holdForSeating(holdForSeating)
                .specialInstructions(dto.getSpecialInstructions())
                .paymentMode(dto.getPaymentMode() != null ? dto.getPaymentMode() : "UPI")
                .paymentStatus("PAID".equalsIgnoreCase(dto.getPaymentMode()) ? "PAID" : "PENDING")
                .items(new ArrayList<>())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderCreateDto.OrderItemCreateDto itemDto : dto.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new BadRequestException("Menu item not found: " + itemDto.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new BadRequestException("Item " + menuItem.getName() + " is currently sold out");
            }

            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .itemNameSnapshot(menuItem.getName())
                    .unitPriceSnapshot(unitPrice)
                    .quantity(itemDto.getQuantity())
                    .spiceLevel(itemDto.getSpiceLevel() != null ? itemDto.getSpiceLevel() : menuItem.getSpiceLevel())
                    .instructions(itemDto.getInstructions())
                    .totalPrice(itemTotal)
                    .build();

            order.getItems().add(orderItem);
        }

        BigDecimal taxAmount = subtotal.multiply(taxRate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount);

        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);

        Order saved = orderRepository.save(order);

        OrderResponseDto responseDto = toDto(saved);

        // Publish live WebSocket events
        eventPublisher.publishOrderUpdate(restaurant.getId(), responseDto);
        eventPublisher.publishSpecificOrderUpdate(saved.getOrderNumber(), responseDto);

        return responseDto;
    }

    public OrderResponseDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return toDto(order);
    }

    public List<OrderResponseDto> getOrdersByRestaurantSlug(String slug) {
        return orderRepository.findByRestaurantSlugOrderByCreatedAtDesc(slug)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDto> getOrdersBySessionId(Long sessionId) {
        return orderRepository.findByTableSessionIdOrderByCreatedAtDesc(sessionId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatusUpdateDto dto, String changedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        String oldStatus = order.getStatus();
        String newStatus = dto.getStatus().toUpperCase();

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(oldStatus)
                .toStatus(newStatus)
                .changedBy(changedBy != null ? changedBy : "Staff")
                .note(dto.getNote())
                .build();

        Order saved = orderRepository.save(order);
        OrderResponseDto responseDto = toDto(saved);

        eventPublisher.publishOrderUpdate(saved.getRestaurant().getId(), responseDto);
        eventPublisher.publishSpecificOrderUpdate(saved.getOrderNumber(), responseDto);

        return responseDto;
    }

    @Transactional
    public OrderResponseDto cancelOrder(String orderNumber, String reason) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        if ("PREPARING".equalsIgnoreCase(order.getStatus()) ||
                "READY".equalsIgnoreCase(order.getStatus()) ||
                "SERVED".equalsIgnoreCase(order.getStatus())) {
            throw new BadRequestException("Order is already being prepared or served and cannot be cancelled");
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        OrderResponseDto responseDto = toDto(saved);

        eventPublisher.publishOrderUpdate(saved.getRestaurant().getId(), responseDto);
        eventPublisher.publishSpecificOrderUpdate(saved.getOrderNumber(), responseDto);

        return responseDto;
    }

    public OrderResponseDto toDto(Order o) {
        List<OrderResponseDto.OrderItemResponseDto> items = o.getItems().stream().map(i ->
                OrderResponseDto.OrderItemResponseDto.builder()
                        .id(i.getId())
                        .menuItemId(i.getMenuItem() != null ? i.getMenuItem().getId() : null)
                        .name(i.getItemNameSnapshot())
                        .unitPrice(i.getUnitPriceSnapshot())
                        .quantity(i.getQuantity())
                        .spiceLevel(i.getSpiceLevel())
                        .instructions(i.getInstructions())
                        .totalPrice(i.getTotalPrice())
                        .build()
        ).collect(Collectors.toList());

        String summary = items.stream()
                .map(i -> i.getQuantity() + " × " + i.getName())
                .collect(Collectors.joining(", "));

        int idx = switch (o.getStatus().toUpperCase()) {
            case "PLACED" -> 0;
            case "ACCEPTED" -> 1;
            case "PREPARING" -> 2;
            case "READY" -> 3;
            case "SERVED", "COMPLETED" -> 4;
            default -> 0;
        };

        long mins = Duration.between(o.getCreatedAt(), LocalDateTime.now()).toMinutes();
        String age = mins <= 1 ? "Just now" : mins + " min";

        return OrderResponseDto.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .destination(o.getDestination())
                .orderType(o.getOrderType())
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .status(o.getStatus())
                .statusIndex(idx)
                .holdForSeating(o.isHoldForSeating())
                .subtotal(o.getSubtotal())
                .taxAmount(o.getTaxAmount())
                .totalAmount(o.getTotalAmount())
                .specialInstructions(o.getSpecialInstructions())
                .paymentStatus(o.getPaymentStatus())
                .paymentMode(o.getPaymentMode())
                .age(age)
                .items(items)
                .itemsSummary(summary)
                .createdAt(o.getCreatedAt())
                .build();
    }
}
