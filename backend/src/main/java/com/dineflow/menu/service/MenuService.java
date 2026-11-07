package com.dineflow.menu.service;

import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.menu.dto.*;
import com.dineflow.menu.entity.MenuCategory;
import com.dineflow.menu.entity.MenuItem;
import com.dineflow.menu.entity.ModifierGroup;
import com.dineflow.menu.entity.ModifierOption;
import com.dineflow.menu.repository.MenuCategoryRepository;
import com.dineflow.menu.repository.MenuItemRepository;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;

    public List<MenuItemDto> getPublicMenu(String slug) {
        return menuItemRepository.findByRestaurantSlug(slug)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<MenuCategoryDto> getCategories(String slug) {
        return categoryRepository.findByRestaurantSlugAndActiveTrueOrderByDisplayOrderAsc(slug)
                .stream()
                .map(c -> MenuCategoryDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .displayOrder(c.getDisplayOrder())
                        .active(c.isActive())
                        .build())
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getAdminMenu(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return toDto(item);
    }

    @Transactional
    public MenuItemDto createMenuItem(Long restaurantId, MenuItemCreateDto dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        MenuCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        MenuItem item = MenuItem.builder()
                .restaurant(restaurant)
                .category(category)
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .emoji(dto.getEmoji() != null ? dto.getEmoji() : "🍽️")
                .imageUrl(dto.getImageUrl())
                .tag(dto.getTag())
                .available(dto.isAvailable())
                .prepTimeMinutes(dto.getPrepTimeMinutes())
                .spiceLevel(dto.getSpiceLevel())
                .vegetarian(dto.isVegetarian())
                .build();

        MenuItem saved = menuItemRepository.save(item);
        return toDto(saved);
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, MenuItemUpdateDto dto) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());
        if (dto.getPrice() != null) item.setPrice(dto.getPrice());
        if (dto.getEmoji() != null) item.setEmoji(dto.getEmoji());
        if (dto.getImageUrl() != null) item.setImageUrl(dto.getImageUrl());
        if (dto.getTag() != null) item.setTag(dto.getTag());
        if (dto.getAvailable() != null) item.setAvailable(dto.getAvailable());
        if (dto.getPrepTimeMinutes() != null) item.setPrepTimeMinutes(dto.getPrepTimeMinutes());
        if (dto.getSpiceLevel() != null) item.setSpiceLevel(dto.getSpiceLevel());
        if (dto.getVegetarian() != null) item.setVegetarian(dto.getVegetarian());

        if (dto.getCategoryId() != null) {
            MenuCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            item.setCategory(category);
        }

        item.setUpdatedAt(LocalDateTime.now());
        MenuItem saved = menuItemRepository.save(item);
        return toDto(saved);
    }

    @Transactional
    public MenuItemDto toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setAvailable(!item.isAvailable());
        item.setUpdatedAt(LocalDateTime.now());
        MenuItem saved = menuItemRepository.save(item);
        return toDto(saved);
    }

    @Transactional
    public MenuCategoryDto createCategory(Long restaurantId, String name, int order) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        MenuCategory category = MenuCategory.builder()
                .restaurant(restaurant)
                .name(name)
                .displayOrder(order)
                .active(true)
                .build();

        MenuCategory saved = categoryRepository.save(category);
        return MenuCategoryDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .displayOrder(saved.getDisplayOrder())
                .active(saved.isActive())
                .build();
    }

    public MenuItemDto toDto(MenuItem item) {
        List<ModifierGroupDto> modGroups = item.getModifierGroups().stream().map(g ->
                ModifierGroupDto.builder()
                        .id(g.getId())
                        .name(g.getName())
                        .required(g.isRequired())
                        .minSelection(g.getMinSelection())
                        .maxSelection(g.getMaxSelection())
                        .options(g.getOptions().stream().map(o ->
                                ModifierOptionDto.builder()
                                        .id(o.getId())
                                        .name(o.getName())
                                        .priceDelta(o.getPriceDelta())
                                        .available(o.isAvailable())
                                        .build()
                        ).collect(Collectors.toList()))
                        .build()
        ).collect(Collectors.toList());

        return MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory() != null ? item.getCategory().getName() : "General")
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .emoji(item.getEmoji())
                .imageUrl(item.getImageUrl())
                .tag(item.getTag())
                .available(item.isAvailable())
                .prepTimeMinutes(item.getPrepTimeMinutes())
                .spiceLevel(item.getSpiceLevel())
                .vegetarian(item.isVegetarian())
                .modifierGroups(modGroups)
                .build();
    }
}
