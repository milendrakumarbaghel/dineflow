package com.dineflow.billing.service;

import com.dineflow.billing.dto.BillDto;
import com.dineflow.billing.dto.PayBillRequest;
import com.dineflow.billing.entity.Bill;
import com.dineflow.billing.entity.BillItem;
import com.dineflow.billing.entity.Payment;
import com.dineflow.billing.repository.BillRepository;
import com.dineflow.billing.repository.PaymentRepository;
import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.order.entity.Order;
import com.dineflow.order.repository.OrderRepository;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;
    private final TableSessionRepository sessionRepository;
    private final DiningTableRepository tableRepository;
    private final OrderRepository orderRepository;

    public BillDto getBillForTable(String tableNumberOrId, String slug) {
        DiningTable table;
        try {
            Long tableId = Long.parseLong(tableNumberOrId);
            table = tableRepository.findById(tableId).orElse(null);
        } catch (NumberFormatException e) {
            table = null;
        }

        if (table == null) {
            table = tableRepository.findByRestaurantSlugAndTableNumber(slug, tableNumberOrId)
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableNumberOrId));
        }

        TableSession session = sessionRepository.findByTableIdAndStatus(table.getId(), "ACTIVE")
                .orElse(null);

        if (session == null) {
            // Return empty draft bill for available table
            return BillDto.builder()
                    .billNumber("B-DRAFT")
                    .tableNumber(table.getTableNumber())
                    .guestName("Guests")
                    .guestCount(2)
                    .subtotal(BigDecimal.ZERO)
                    .taxAmount(BigDecimal.ZERO)
                    .serviceCharge(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .totalDue(BigDecimal.ZERO)
                    .status("PAID")
                    .splitCount(1)
                    .shareAmount(BigDecimal.ZERO)
                    .sessionStartedAt(LocalDateTime.now())
                    .items(new ArrayList<>())
                    .build();
        }

        return getOrCreateSessionBill(session);
    }

    @Transactional
    public BillDto getOrCreateSessionBill(TableSession session) {
        Bill bill = billRepository.findByTableSessionId(session.getId()).orElse(null);

        List<Order> orders = orderRepository.findByTableSessionIdOrderByCreatedAtDesc(session.getId());

        if (bill == null) {
            bill = Bill.builder()
                    .restaurant(session.getRestaurant())
                    .tableSession(session)
                    .billNumber("B-" + (2040 + session.getId()))
                    .status("UNPAID")
                    .splitCount(1)
                    .items(new ArrayList<>())
                    .build();
        }

        // Recompute live from orders
        BigDecimal subtotal = BigDecimal.ZERO;
        List<Bill.BillBuilder> itemsToBuild = new ArrayList<>();

        List<BillDto.BillItemDto> billItemDtos = new ArrayList<>();

        for (Order o : orders) {
            subtotal = subtotal.add(o.getSubtotal());
            o.getItems().forEach(i -> {
                billItemDtos.add(BillDto.BillItemDto.builder()
                        .itemName(i.getItemNameSnapshot())
                        .quantity(i.getQuantity())
                        .totalAmount(i.getTotalPrice())
                        .build());
            });
        }

        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalDue = subtotal.add(taxAmount);

        bill.setSubtotal(subtotal);
        bill.setTaxAmount(taxAmount);
        bill.setTotalDue(totalDue);

        Bill saved = billRepository.save(bill);

        return BillDto.builder()
                .id(saved.getId())
                .billNumber(saved.getBillNumber())
                .tableSessionId(session.getId())
                .tableNumber(session.getTable().getTableNumber())
                .guestName(session.getGuestName())
                .guestCount(session.getGuestCount())
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .serviceCharge(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalDue(totalDue)
                .status(saved.getStatus())
                .splitCount(saved.getSplitCount())
                .shareAmount(saved.getSplitCount() > 1 ? totalDue.divide(BigDecimal.valueOf(saved.getSplitCount()), 2, RoundingMode.HALF_UP) : totalDue)
                .sessionStartedAt(session.getStartedAt())
                .items(billItemDtos)
                .build();
    }

    @Transactional
    public BillDto payBill(Long billId, PayBillRequest request, String collectedBy) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));

        BigDecimal amount = request.getAmount() != null ? request.getAmount() : bill.getTotalDue();

        Payment payment = Payment.builder()
                .restaurant(bill.getRestaurant())
                .bill(bill)
                .amount(amount)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI")
                .status("PAID")
                .transactionReference(request.getTransactionReference() != null ? request.getTransactionReference() : "TXN-" + System.currentTimeMillis())
                .collectedBy(collectedBy != null ? collectedBy : "Self-checkout")
                .paidAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        bill.setStatus("PAID");
        bill.setSplitCount(request.getSplitCount() > 0 ? request.getSplitCount() : 1);
        bill.setUpdatedAt(LocalDateTime.now());
        Bill saved = billRepository.save(bill);

        // Update all orders in session to PAID
        orderRepository.findByTableSessionIdOrderByCreatedAtDesc(bill.getTableSession().getId()).forEach(o -> {
            o.setPaymentStatus("PAID");
            orderRepository.save(o);
        });

        return toDto(saved);
    }

    public BillDto toDto(Bill b) {
        List<BillDto.BillItemDto> items = b.getItems().stream().map(i ->
                BillDto.BillItemDto.builder()
                        .itemName(i.getItemName())
                        .quantity(i.getQuantity())
                        .totalAmount(i.getTotalAmount())
                        .build()
        ).collect(Collectors.toList());

        BigDecimal share = b.getSplitCount() > 1 ?
                b.getTotalDue().divide(BigDecimal.valueOf(b.getSplitCount()), 2, RoundingMode.HALF_UP) :
                b.getTotalDue();

        return BillDto.builder()
                .id(b.getId())
                .billNumber(b.getBillNumber())
                .tableSessionId(b.getTableSession().getId())
                .tableNumber(b.getTableSession().getTable().getTableNumber())
                .guestName(b.getTableSession().getGuestName())
                .guestCount(b.getTableSession().getGuestCount())
                .subtotal(b.getSubtotal())
                .taxAmount(b.getTaxAmount())
                .serviceCharge(b.getServiceCharge())
                .discountAmount(b.getDiscountAmount())
                .totalDue(b.getTotalDue())
                .status(b.getStatus())
                .splitCount(b.getSplitCount())
                .shareAmount(share)
                .sessionStartedAt(b.getTableSession().getStartedAt())
                .items(items)
                .build();
    }
}
