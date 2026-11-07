package com.dineflow;

import com.dineflow.billing.dto.BillDto;
import com.dineflow.billing.dto.PayBillRequest;
import com.dineflow.billing.entity.Bill;
import com.dineflow.billing.repository.BillRepository;
import com.dineflow.billing.repository.PaymentRepository;
import com.dineflow.billing.service.BillingService;
import com.dineflow.order.entity.Order;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.session.entity.TableSession;
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
class BillingServiceTest {

    @Mock
    private BillRepository billRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private TableSessionRepository sessionRepository;
    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private BillingService billingService;

    private Restaurant restaurant;
    private DiningTable table;
    private TableSession session;

    @BeforeEach
    void setUp() {
        restaurant = Restaurant.builder().id(1L).slug("ember-and-olive").build();
        table = DiningTable.builder().id(4L).restaurant(restaurant).tableNumber("T04").build();
        session = TableSession.builder()
                .id(1L)
                .restaurant(restaurant)
                .table(table)
                .sessionCode("SES-2084")
                .guestName("Aarav Sharma")
                .guestCount(3)
                .startedAt(LocalDateTime.now())
                .status("ACTIVE")
                .build();
    }

    @Test
    void testGetBillAggregatesOrdersAndCalculatesTax() {
        when(tableRepository.findByRestaurantSlugAndTableNumber("ember-and-olive", "T04"))
                .thenReturn(Optional.of(table));
        when(sessionRepository.findByTableIdAndStatus(4L, "ACTIVE"))
                .thenReturn(Optional.of(session));
        when(billRepository.findByTableSessionId(1L)).thenReturn(Optional.empty());

        Order o1 = Order.builder().id(1L).subtotal(new BigDecimal("289.00")).items(Collections.emptyList()).build();
        Order o2 = Order.builder().id(2L).subtotal(new BigDecimal("358.00")).items(Collections.emptyList()).build();
        when(orderRepository.findByTableSessionIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(o1, o2));

        when(billRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        BillDto bill = billingService.getBillForTable("T04", "ember-and-olive");

        assertNotNull(bill);
        assertEquals(new BigDecimal("647.00"), bill.getSubtotal()); // 289 + 358
        assertEquals(new BigDecimal("32.35"), bill.getTaxAmount()); // 647 * 0.05
        assertEquals(new BigDecimal("679.35"), bill.getTotalDue());
        assertEquals("UNPAID", bill.getStatus());
    }

    @Test
    void testPayBillSettlesInvoiceAndSupportsSplits() {
        Bill bill = Bill.builder()
                .id(1L)
                .restaurant(restaurant)
                .tableSession(session)
                .billNumber("B-2048")
                .subtotal(new BigDecimal("647.00"))
                .taxAmount(new BigDecimal("32.35"))
                .totalDue(new BigDecimal("679.35"))
                .status("UNPAID")
                .splitCount(1)
                .items(Collections.emptyList())
                .build();

        when(billRepository.findById(1L)).thenReturn(Optional.of(bill));
        when(billRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(orderRepository.findByTableSessionIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.emptyList());

        PayBillRequest payReq = new PayBillRequest();
        payReq.setSplitCount(3);
        payReq.setPaymentMethod("UPI");
        payReq.setAmount(new BigDecimal("226.45"));

        BillDto paid = billingService.payBill(1L, payReq, "Aarav");

        assertEquals("PAID", paid.getStatus());
        assertEquals(3, paid.getSplitCount());
        verify(paymentRepository, times(1)).save(any());
    }
}
