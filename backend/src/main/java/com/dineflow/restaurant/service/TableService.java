package com.dineflow.restaurant.service;

import com.dineflow.common.exception.ConflictException;
import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.common.util.QrCodeGenerator;
import com.dineflow.notification.WebSocketEventPublisher;
import com.dineflow.restaurant.dto.DiningTableDto;
import com.dineflow.restaurant.dto.TableCreateDto;
import com.dineflow.restaurant.dto.TableUpdateDto;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.entity.TableQrToken;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.repository.TableQrTokenRepository;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final DiningTableRepository tableRepository;
    private final RestaurantRepository restaurantRepository;
    private final TableQrTokenRepository qrTokenRepository;
    private final TableSessionRepository sessionRepository;
    private final WebSocketEventPublisher eventPublisher;

    public List<DiningTableDto> getTablesByRestaurantSlug(String slug) {
        return tableRepository.findByRestaurantSlugOrderByTableNumberAsc(slug)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<DiningTableDto> getTablesByRestaurantId(Long restaurantId) {
        return tableRepository.findByRestaurantIdOrderByTableNumberAsc(restaurantId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DiningTableDto getTableById(Long tableId) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));
        return toDto(table);
    }

    @Transactional
    public DiningTableDto createTable(Long restaurantId, TableCreateDto dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (tableRepository.findByRestaurantIdAndTableNumber(restaurantId, dto.getTableNumber()).isPresent()) {
            throw new ConflictException("Table number " + dto.getTableNumber() + " already exists");
        }

        DiningTable table = DiningTable.builder()
                .restaurant(restaurant)
                .tableNumber(dto.getTableNumber())
                .seatsCapacity(dto.getSeatsCapacity())
                .status(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE")
                .currentGuestNote(dto.getCurrentGuestNote() != null ? dto.getCurrentGuestNote() : "Ready to seat")
                .active(true)
                .build();

        DiningTable saved = tableRepository.save(table);

        // Generate unguessable QR token
        String tokenVal = "token-" + dto.getTableNumber().toLowerCase() + "-" + UUID.randomUUID().toString().substring(0, 8);
        TableQrToken token = TableQrToken.builder()
                .table(saved)
                .tokenValue(tokenVal)
                .tokenHash("hash-" + UUID.randomUUID().toString().substring(0, 8))
                .revoked(false)
                .build();
        qrTokenRepository.save(token);

        DiningTableDto result = toDto(saved);
        eventPublisher.publishTableUpdate(restaurantId, result);
        return result;
    }

    @Transactional
    public DiningTableDto updateTable(Long tableId, TableUpdateDto dto) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        if (dto.getTableNumber() != null) {
            table.setTableNumber(dto.getTableNumber());
        }
        if (dto.getSeatsCapacity() != null) {
            table.setSeatsCapacity(dto.getSeatsCapacity());
        }
        if (dto.getStatus() != null) {
            table.setStatus(dto.getStatus());
        }
        if (dto.getCurrentGuestNote() != null) {
            table.setCurrentGuestNote(dto.getCurrentGuestNote());
        }
        table.setUpdatedAt(LocalDateTime.now());

        DiningTable saved = tableRepository.save(table);
        DiningTableDto result = toDto(saved);
        eventPublisher.publishTableUpdate(saved.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public DiningTableDto updateStatus(Long tableId, String newStatus, String guestNote) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        // Enforce business invariant: a table cannot become available while an active session remains open
        if ("AVAILABLE".equalsIgnoreCase(newStatus)) {
            sessionRepository.findByTableIdAndStatus(tableId, "ACTIVE")
                    .ifPresent(s -> {
                        throw new ConflictException("Cannot mark table available while table session " + s.getSessionCode() + " is still active. Please close session first.");
                    });
        }

        table.setStatus(newStatus.toUpperCase());
        if (guestNote != null) {
            table.setCurrentGuestNote(guestNote);
        } else if ("AVAILABLE".equalsIgnoreCase(newStatus)) {
            table.setCurrentGuestNote("Ready to seat");
        } else if ("CLEANING".equalsIgnoreCase(newStatus)) {
            table.setCurrentGuestNote("Needs reset");
        } else if ("OCCUPIED".equalsIgnoreCase(newStatus)) {
            table.setCurrentGuestNote("Guests seated");
        }
        table.setUpdatedAt(LocalDateTime.now());

        DiningTable saved = tableRepository.save(table);
        DiningTableDto result = toDto(saved);
        eventPublisher.publishTableUpdate(saved.getRestaurant().getId(), result);
        return result;
    }

    @Transactional
    public TableSession startSession(Long tableId, String guestName, int guestCount) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        // Ensure no active session exists
        sessionRepository.findByTableIdAndStatus(tableId, "ACTIVE")
                .ifPresent(s -> {
                    throw new ConflictException("Table already has an active session: " + s.getSessionCode());
                });

        String sessionCode = "SES-" + (1000 + (int)(Math.random() * 9000));
        TableSession session = TableSession.builder()
                .restaurant(table.getRestaurant())
                .table(table)
                .sessionCode(sessionCode)
                .guestName(guestName != null ? guestName : "Guests")
                .guestCount(guestCount > 0 ? guestCount : 2)
                .status("ACTIVE")
                .startedAt(LocalDateTime.now())
                .build();

        TableSession savedSession = sessionRepository.save(session);

        // Update table to OCCUPIED
        table.setStatus("OCCUPIED");
        table.setCurrentGuestNote(guestName != null ? guestName + " · " + guestCount + " guests" : guestCount + " guests");
        tableRepository.save(table);

        eventPublisher.publishTableUpdate(table.getRestaurant().getId(), toDto(table));
        return savedSession;
    }

    @Transactional
    public DiningTableDto closeSession(Long tableId) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        sessionRepository.findByTableIdAndStatus(tableId, "ACTIVE").ifPresent(session -> {
            session.setStatus("CLOSED");
            session.setClosedAt(LocalDateTime.now());
            sessionRepository.save(session);
        });

        table.setStatus("CLEANING");
        table.setCurrentGuestNote("Needs reset");
        table.setUpdatedAt(LocalDateTime.now());
        DiningTable saved = tableRepository.save(table);

        DiningTableDto result = toDto(saved);
        eventPublisher.publishTableUpdate(saved.getRestaurant().getId(), result);
        return result;
    }

    public DiningTableDto toDto(DiningTable table) {
        TableQrToken token = qrTokenRepository.findByTableIdAndRevokedFalse(table.getId()).orElse(null);
        String tokenVal = token != null ? token.getTokenValue() : "TF-" + table.getTableNumber() + "-8K2";

        String slug = table.getRestaurant() != null ? table.getRestaurant().getSlug() : "ember-and-olive";
        String qrDataUrl = QrCodeGenerator.generateQrBase64("/r/" + slug + "/t/" + tokenVal, 200, 200);

        return DiningTableDto.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .seatsCapacity(table.getSeatsCapacity())
                .status(table.getStatus())
                .currentGuestNote(table.getCurrentGuestNote())
                .qrToken(tokenVal)
                .qrCodeDataUrl(qrDataUrl)
                .areaName(table.getArea() != null ? table.getArea().getName() : "Dining Room")
                .build();
    }
}
