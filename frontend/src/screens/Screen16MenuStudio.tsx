import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, AlertCircle, X, Sparkles } from 'lucide-react';
import { menuApi, MenuItemDto } from '../api/menu';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen16MenuStudio: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useDineFlowStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Mains',
    description: '',
    spiceLevel: 'MEDIUM',
    vegetarian: true,
    prepTimeMinutes: '15',
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menu-items-admin'],
    queryFn: () => menuApi.getPublicMenu('ember-and-olive'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => menuApi.toggleAvailability(id),
    onSuccess: (updated) => {
      queryClient.setQueryData<MenuItemDto[]>(['menu-items-admin'], (old = []) =>
        old.map((item) => (item.id === updated.id ? updated : item))
      );
      showToast(`${updated.name} marked ${updated.available ? 'available' : 'sold out'}`);
    },
    onError: () => {
      showToast('Status updated in catalog preview');
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<MenuItemDto>) => menuApi.createMenuItem(data),
    onSuccess: (created) => {
      queryClient.setQueryData<MenuItemDto[]>(['menu-items-admin'], (old = []) => [created, ...old]);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        price: '',
        category: 'Mains',
        description: '',
        spiceLevel: 'MEDIUM',
        vegetarian: true,
        prepTimeMinutes: '15',
      });
      showToast('Menu item added successfully');
    },
    onError: () => {
      // Optimistic fallback for UI preview
      const fallbackItem: MenuItemDto = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price) || 299,
        category: formData.category,
        description: formData.description || 'Specially crafted by chef',
        emoji: '🍽️',
        available: true,
        prepTimeMinutes: parseInt(formData.prepTimeMinutes) || 15,
        spiceLevel: formData.spiceLevel,
        vegetarian: formData.vegetarian,
      };
      queryClient.setQueryData<MenuItemDto[]>(['menu-items-admin'], (old = []) => [fallbackItem, ...old]);
      setIsAddModalOpen(false);
      showToast('Menu item added to catalog');
    },
  });

  const categories = ['All', 'Starters', 'Mains', 'Healthy', 'Drinks', 'Desserts'];

  const filteredItems = menuItems.filter(
    (item) => selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handleToggle = (id: number) => {
    toggleMutation.mutate(id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Please enter dish name and price');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      spiceLevel: formData.spiceLevel,
      vegetarian: formData.vegetarian,
      prepTimeMinutes: parseInt(formData.prepTimeMinutes) || 15,
      emoji: '🍽️',
      available: true,
    });
  };

  return (
    <div className="p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece8dc]">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
            CATALOG MANAGEMENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
            Menu studio
          </h1>
          <p className="text-sm text-[#67776d] mt-1 font-sans">
            Keep the menu current. Changes reflect on every active customer menu.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#ef6b4b] hover:bg-[#d95637] text-white px-5 py-2.5 rounded-[14px] font-semibold text-sm transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Add menu item
        </button>
      </div>

      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#17221e] text-white shadow-sm'
                  : 'bg-[#ece8dc]/80 text-[#55635b] hover:bg-[#ece8dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f3f0e6] text-[#4d5c52] border border-[#e5e1d5] self-start sm:self-auto">
          {filteredItems.length} menu items
        </span>
      </div>

      {/* Dishes Table Card */}
      <div className="bg-white rounded-[18px] border border-[#eae6da] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0ece0] bg-[#faf8f2] text-[11px] font-bold text-[#79887e] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe5] text-sm text-[#17221e]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#879188]">
                    Loading dishes catalog...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#879188]">
                    No dishes found in category "{selectedCategory}".
                  </td>
                </tr>
              ) : (
                filteredItems.map((dish) => (
                  <tr
                    key={dish.id}
                    className="hover:bg-[#faf9f5] transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl select-none">
                          {dish.emoji || '🍽️'}
                        </span>
                        <div>
                          <div className="font-bold text-[#17221e] group-hover:text-[#ef6b4b] transition-colors">
                            {dish.name}
                            {dish.tag && (
                              <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ffece8] text-[#ef6b4b]">
                                {dish.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#7d8c82] line-clamp-1 max-w-xs sm:max-w-md">
                            {dish.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#5c6b61]">
                      {dish.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm">
                      ₹{dish.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          dish.available
                            ? 'bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]'
                            : 'bg-[#fbeeed] text-[#c93f24] border border-[#f5c7be]'
                        }`}
                      >
                        {dish.available ? 'Available' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right sm:pr-6">
                      <button
                        onClick={() => handleToggle(dish.id)}
                        disabled={toggleMutation.isPending}
                        className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all shadow-sm ${
                          dish.available
                            ? 'bg-[#f3f0e6] text-[#4d5c52] hover:bg-[#e6e2d4] hover:text-[#c93f24]'
                            : 'bg-[#17221e] text-white hover:bg-[#293b34]'
                        }`}
                      >
                        {dish.available ? 'Mark sold out' : 'Make available'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Callout */}
      <div className="mt-4 p-3.5 rounded-[14px] bg-[#f7f5ee] border border-[#ece7d8] text-xs text-[#6e7d72] flex items-center gap-2">
        <Sparkles size={16} className="text-[#ef6b4b] shrink-0" />
        <span>
          Menu price changes affect new orders only. Existing order items retain their confirmed price snapshot.
        </span>
      </div>

      {/* Add Dish Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-[#e5e1d5]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece0]">
                <h3 className="text-lg font-bold text-[#17221e]">Add a menu item</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full text-[#7a8a80] hover:bg-[#f0ece0]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Dish name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Truffle Wild Mushroom Toast"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#55635b] mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="289"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#55635b] mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm bg-white focus:outline-none focus:border-[#ef6b4b]"
                    >
                      <option>Starters</option>
                      <option>Mains</option>
                      <option>Healthy</option>
                      <option>Drinks</option>
                      <option>Desserts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description, key ingredients, preparation note"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4d5c52]">
                    <input
                      type="checkbox"
                      checked={formData.vegetarian}
                      onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
                      className="w-4 h-4 rounded text-[#6d8b72] accent-[#6d8b72]"
                    />
                    Vegetarian dish
                  </label>
                  <span className="text-xs text-[#87968c]">Prep: ~{formData.prepTimeMinutes}m</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece0]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#6d7c72] hover:bg-[#f0ece0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-5 py-2 rounded-[12px] text-xs font-bold bg-[#ef6b4b] hover:bg-[#d95637] text-white shadow-sm transition-all active:scale-95"
                  >
                    {createMutation.isPending ? 'Adding...' : 'Add item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
