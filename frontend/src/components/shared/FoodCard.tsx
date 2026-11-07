import React from 'react';
import { MenuItemDto } from '../../api/menu';
import { useDineFlowStore } from '../../store/useDineFlowStore';

interface FoodCardProps {
  item: MenuItemDto;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { setSelectedItem, setScreen, addToCart } = useDineFlowStore();

  const handleOpenDetail = () => {
    setSelectedItem(item.id);
    setScreen('item-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
      qty: 1,
      spiceLevel: item.spiceLevel,
    });
  };

  return (
    <div
      onClick={handleOpenDetail}
      className={`border border-[#e9e5d9] bg-[#fffefa] rounded-[17px] overflow-hidden transition-all duration-250 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_18px_32px_rgba(36,48,39,0.10)] group ${
        !item.available ? 'opacity-65' : ''
      }`}
    >
      {/* Food Art Plate */}
      <div
        className="h-[118px] grid place-items-center relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 65%, #f6d8b8, #f0e6d1 55%, #eee8db)',
        }}
      >
        <div
          className="absolute w-[130px] h-[130px] rounded-[50%] shadow-[0_13px_22px_#5d47301a]"
          style={{
            background: 'radial-gradient(circle, #fffefa 0 48%, #d9d0bd 50% 55%, #fffefa 57%)',
            transform: 'rotateX(58deg) translateY(10px)',
          }}
        />

        <span className="relative z-1 text-[55px] drop-shadow-[0_10px_8px_#6b4d2c33] -translate-y-0.5 transition-transform duration-400 group-hover:-translate-y-2 group-hover:scale-110 group-hover:-rotate-6">
          {item.emoji || '🍽️'}
        </span>

        {item.tag && (
          <span className="absolute top-2 left-2 bg-[#fbe8e1] text-[#c45137] border border-[#f5d6cb] rounded-full px-2 py-0.5 text-[9px] font-extrabold">
            {item.tag}
          </span>
        )}

        {!item.available && (
          <span className="absolute bottom-2 right-2 bg-[#fbe8e1] text-[#c45137] border border-[#f5d6cb] rounded-full px-2 py-0.5 text-[9px] font-extrabold">
            Sold out
          </span>
        )}
      </div>

      {/* Food Info */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-1">
          <strong className="font-heading font-extrabold text-[12px] text-[#1d2925] truncate">
            {item.name}
          </strong>
          {item.available ? (
            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${item.name}`}
              className="w-7 h-7 rounded-full bg-[#ef6b4b] text-white text-[17px] font-bold shadow-[0_5px_12px_#ef6b4b40] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform flex-none"
            >
              +
            </button>
          ) : (
            <span className="text-[9px] text-[#8a938b] font-medium">Unavailable</span>
          )}
        </div>

        <p className="text-[9px] text-[#8a938b] leading-[1.45] my-1.5 min-h-[26px] line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-[#f0eee6]">
          <b className="text-[11px] font-extrabold text-[#1d2925]">
            ₹{Number(item.price).toLocaleString('en-IN')}
          </b>
          <span className="text-[9px] text-[#8a938b] font-semibold">{item.category}</span>
        </div>
      </div>
    </div>
  );
};
