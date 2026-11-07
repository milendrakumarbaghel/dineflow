package com.dineflow.restaurant.service;

import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.common.util.QrCodeGenerator;
import com.dineflow.restaurant.dto.DiningTableDto;
import com.dineflow.restaurant.dto.QrContextResponse;
import com.dineflow.restaurant.dto.RestaurantDto;
import com.dineflow.restaurant.entity.DiningTable;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.entity.RestaurantSettings;
import com.dineflow.restaurant.entity.TableQrToken;
import com.dineflow.restaurant.repository.DiningTableRepository;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.restaurant.repository.RestaurantSettingsRepository;
import com.dineflow.restaurant.repository.TableQrTokenRepository;
import com.dineflow.session.entity.TableSession;
import com.dineflow.session.repository.TableSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantSettingsRepository settingsRepository;
    private final TableQrTokenRepository qrTokenRepository;
    private final DiningTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;

    public Restaurant getBySlug(String slug) {
        return restaurantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with slug: " + slug));
    }

    public RestaurantDto getRestaurantDtoBySlug(String slug) {
        Restaurant restaurant = getBySlug(slug);
        RestaurantSettings settings = settingsRepository.findByRestaurantId(restaurant.getId()).orElse(null);

        return toRestaurantDto(restaurant, settings);
    }

    public QrContextResponse resolveQrContext(String slug, String qrToken) {
        Restaurant restaurant = getBySlug(slug);
        TableQrToken token = qrTokenRepository.findByTokenValueAndRevokedFalse(qrToken)
                .orElse(null);

        if (token == null) {
            // Also support matching direct table number as friendly fallback, e.g. "T04"
            DiningTable directTable = tableRepository.findByRestaurantSlugAndTableNumber(slug, qrToken).orElse(null);
            if (directTable != null) {
                token = qrTokenRepository.findByTableIdAndRevokedFalse(directTable.getId()).orElse(null);
            }
        }

        if (token == null) {
            return QrContextResponse.builder()
                    .restaurant(getRestaurantDtoBySlug(slug))
                    .valid(false)
                    .message("Invalid, expired, or revoked QR code. Please ask restaurant staff for assistance.")
                    .build();
        }

        DiningTable table = token.getTable();
        RestaurantSettings settings = settingsRepository.findByRestaurantId(restaurant.getId()).orElse(null);

        // Find active table session
        TableSession activeSession = sessionRepository.findByTableIdAndStatus(table.getId(), "ACTIVE").orElse(null);

        String qrDataUrl = QrCodeGenerator.generateQrBase64("/r/" + slug + "/t/" + token.getTokenValue(), 250, 250);

        DiningTableDto tableDto = DiningTableDto.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .seatsCapacity(table.getSeatsCapacity())
                .status(table.getStatus())
                .currentGuestNote(table.getCurrentGuestNote())
                .qrToken(token.getTokenValue())
                .qrCodeDataUrl(qrDataUrl)
                .areaName(table.getArea() != null ? table.getArea().getName() : "Dining Room")
                .build();

        return QrContextResponse.builder()
                .restaurant(toRestaurantDto(restaurant, settings))
                .table(tableDto)
                .activeSessionId(activeSession != null ? activeSession.getId() : null)
                .sessionCode(activeSession != null ? activeSession.getSessionCode() : null)
                .valid(true)
                .message("Table identified successfully")
                .build();
    }

    @Transactional
    public RestaurantDto updateSettings(Long restaurantId, RestaurantDto dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (dto.getName() != null) restaurant.setName(dto.getName());
        if (dto.getTimezone() != null) restaurant.setTimezone(dto.getTimezone());
        restaurantRepository.save(restaurant);

        RestaurantSettings settings = settingsRepository.findByRestaurantId(restaurantId)
                .orElseGet(() -> RestaurantSettings.builder().restaurant(restaurant).build());

        settings.setAllowQrOrdering(dto.isAllowQrOrdering());
        settings.setAllowCounterPickup(dto.isAllowCounterPickup());
        settings.setRequireStaffAcceptance(dto.isRequireStaffAcceptance());
        settings.setAllowOrderCancellation(dto.isAllowOrderCancellation());
        settings.setNoShowGraceMinutes(dto.getNoShowGraceMinutes());
        if (dto.getSeatingStrategy() != null) settings.setSeatingStrategy(dto.getSeatingStrategy());
        if (dto.getAdvanceOrderPolicy() != null) settings.setAdvanceOrderPolicy(dto.getAdvanceOrderPolicy());
        if (dto.getDefaultTaxRate() != null) settings.setDefaultTaxRate(dto.getDefaultTaxRate());
        if (dto.getServiceChargeRate() != null) settings.setServiceChargeRate(dto.getServiceChargeRate());

        settingsRepository.save(settings);

        return toRestaurantDto(restaurant, settings);
    }

    private RestaurantDto toRestaurantDto(Restaurant r, RestaurantSettings s) {
        return RestaurantDto.builder()
                .id(r.getId())
                .name(r.getName())
                .slug(r.getSlug())
                .description(r.getDescription())
                .logoUrl(r.getLogoUrl())
                .currency(r.getCurrency())
                .currencySymbol(r.getCurrencySymbol())
                .timezone(r.getTimezone())
                .active(r.isActive())
                .allowQrOrdering(s == null || s.isAllowQrOrdering())
                .allowCounterPickup(s == null || s.isAllowCounterPickup())
                .requireStaffAcceptance(s == null || s.isRequireStaffAcceptance())
                .allowOrderCancellation(s != null && s.isAllowOrderCancellation())
                .noShowGraceMinutes(s != null ? s.getNoShowGraceMinutes() : 5)
                .seatingStrategy(s != null ? s.getSeatingStrategy() : "FIFO_CAPACITY_FIT")
                .advanceOrderPolicy(s != null ? s.getAdvanceOrderPolicy() : "AFTER_SEATING_DEFAULT")
                .defaultTaxRate(s != null ? s.getDefaultTaxRate() : new java.math.BigDecimal("5.00"))
                .serviceChargeRate(s != null ? s.getServiceChargeRate() : java.math.BigDecimal.ZERO)
                .build();
    }
}
