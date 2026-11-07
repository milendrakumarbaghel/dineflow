package com.dineflow;

import com.dineflow.common.exception.BadRequestException;
import com.dineflow.menu.entity.MenuItem;
import com.dineflow.menu.repository.MenuItemRepository;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.order.dto.OrderCreateDto;
import com.dineflow.order.dto.OrderResponseDto;
import com.dineflow.order.dto.OrderStatusUpdateDto;
import com.dineflow.order.entity.Order;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.order.service.OrderService;
import com.dineflow.queue.repository.QueueTicketRepository;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.entity.RestaurantSettings;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.repository.RestaurantSettingsRepository;
import com.dineflow.session.repository.TableSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private MenuItemRepository menuItemRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private RestaurantSettingsRepository settingsRepository;
    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private TableSessionRepository sessionRepository;
    @Mock
    private QueueTicketRepository queueTicketRepository;
    @Mock
    private WebSocketEventPublisher eventPublisher;

    @InjectMocks
    private OrderService orderService;

    private Restaurant restaurant;
    private MenuItem menuItem;

    @BeforeEach
    void setUp() {
        restaurant = Restaurant.builder().id(1L).slug("ember-and-olive").name("Ember & Olive").build();
        menuItem = MenuItem.builder()
                .id(1L)
                .name("Smoky Paneer Tikka")
                .price(new BigDecimal("289.00"))
                .available(true)
                .spiceLevel("MEDIUM")
                .modifierGroups(Collections.emptySet())
                .build();
    }

    @Test
    void testCreateOrderCalculatesAuthoritativePriceAndTax() {
        when(restaurantRepository.findBySlug("ember-and-olive")).thenReturn(Optional.of(restaurant));
        when(settingsRepository.findByRestaurantId(1L)).thenReturn(Optional.of(
                RestaurantSettings.builder().defaultTaxRate(new BigDecimal("5.00")).build()
        ));
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));
        when(orderRepository.count()).thenReturn(5L);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(10L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });

        OrderCreateDto dto = new OrderCreateDto();
        dto.setRestaurantSlug("ember-and-olive");
        dto.setDestination("T04");
        dto.setCustomerName("Aarav");

        OrderCreateDto.OrderItemCreateDto itemDto = new OrderCreateDto.OrderItemCreateDto();
        itemDto.setMenuItemId(1L);
        itemDto.setQuantity(2);
        dto.setItems(List.of(itemDto));

        OrderResponseDto response = orderService.createOrder(dto);

        assertNotNull(response);
        assertEquals("TF-1055", response.getOrderNumber());
        assertEquals(new BigDecimal("578.00"), response.getSubtotal()); // 289 * 2
        assertEquals(new BigDecimal("28.90"), response.getTaxAmount()); // 578 * 0.05
        assertEquals(new BigDecimal("606.90"), response.getTotalAmount());
        assertEquals("PLACED", response.getStatus());

        verify(eventPublisher, times(1)).publishOrderUpdate(eq(1L), any());
    }

    @Test
    void testCreateOrderRejectsSoldOutItem() {
        menuItem.setAvailable(false);
        when(restaurantRepository.findBySlug("ember-and-olive")).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));

        OrderCreateDto dto = new OrderCreateDto();
        dto.setRestaurantSlug("ember-and-olive");
        OrderCreateDto.OrderItemCreateDto itemDto = new OrderCreateDto.OrderItemCreateDto();
        itemDto.setMenuItemId(1L);
        dto.setItems(List.of(itemDto));

        assertThrows(BadRequestException.class, () -> orderService.createOrder(dto));
    }

    @Test
    void testUpdateOrderStatus() {
        Order order = Order.builder()
                .id(1L)
                .orderNumber("TF-1048")
                .restaurant(restaurant)
                .status("PLACED")
                .subtotal(new BigDecimal("200"))
                .taxAmount(new BigDecimal("10"))
                .totalAmount(new BigDecimal("210"))
                .createdAt(LocalDateTime.now())
                .items(Collections.emptyList())
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        OrderStatusUpdateDto updateDto = new OrderStatusUpdateDto();
        updateDto.setStatus("PREPARING");
        updateDto.setNote("Cooking started");

        OrderResponseDto updated = orderService.updateOrderStatus(1L, updateDto, "Chef Dev");

        assertEquals("PREPARING", updated.getStatus());
        assertEquals(2, updated.getStatusIndex());
        verify(eventPublisher, times(1)).publishOrderUpdate(eq(1L), any());
    }
}
