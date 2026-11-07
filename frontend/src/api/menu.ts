import { apiRequest } from './client';

export interface ModifierOptionDto {
  id: number;
  name: string;
  priceDelta: number;
  available: boolean;
}

export interface ModifierGroupDto {
  id: number;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  options: ModifierOptionDto[];
}

export interface MenuItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: number;
  emoji?: string;
  imageUrl?: string;
  tag?: string;
  available: boolean;
  prepTimeMinutes: number;
  spiceLevel: string;
  vegetarian: boolean;
  modifierGroups?: ModifierGroupDto[];
}

export interface MenuCategoryDto {
  id: number;
  name: string;
  displayOrder: number;
  active: boolean;
}

export const menuApi = {
  getPublicMenu: (slug = 'ember-and-olive') =>
    apiRequest<MenuItemDto[]>(`/public/restaurants/${slug}/menu`),

  getCategories: (slug = 'ember-and-olive') =>
    apiRequest<MenuCategoryDto[]>(`/public/restaurants/${slug}/categories`),

  getAdminMenu: () =>
    apiRequest<MenuItemDto[]>(`/admin/menu`),

  createMenuItem: (data: Partial<MenuItemDto>) =>
    apiRequest<MenuItemDto>(`/admin/menu`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleAvailability: (id: number) =>
    apiRequest<MenuItemDto>(`/admin/menu/${id}/toggle-availability`, {
      method: 'PATCH',
    }),
};
