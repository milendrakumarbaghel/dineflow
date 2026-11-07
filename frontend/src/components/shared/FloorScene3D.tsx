import React from 'react';

interface FloorScene3DProps {
  onTableClick?: (tableId: string) => void;
}

export const FloorScene3D: React.FC<FloorScene3DProps> = ({ onTableClick }) => {
  return (
    <div
      className="relative h-[255px] [perspective:900px] overflow-hidden rounded-[18px]"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #f6f1e5, #eae6d8)' }}
    >
      <div
        className="absolute left-[12%] top-[5%] w-[76%] h-[88%] [transform-style:preserve-3d] border border-[#cfc5b0] shadow-[0_35px_25px_#6b5c4020] animate-floor-drift"
        style={{
          transform: 'rotateX(57deg) rotateZ(-28deg)',
          backgroundImage:
            'linear-gradient(#d3cbb9 1px, transparent 1px), linear-gradient(90deg, #d3cbb9 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      >
        {/* Iso Table 1 */}
        <div
          onClick={() => onTableClick?.('T01')}
          className="absolute w-[54px] h-[54px] rounded-[50%] border-[7px] border-white shadow-[0_12px_0_#b8a783,0_18px_18px_#66573c35] grid place-items-center text-[10px] font-black text-[#4e5c50] cursor-pointer animate-table-bob hover:scale-110 transition-transform"
          style={{
            left: '15%',
            top: '15%',
            transform: 'translateZ(20px)',
            background: 'linear-gradient(145deg, #f7c0a5, #dc815f)',
          }}
        >
          T01
        </div>

        {/* Iso Table 2 */}
        <div
          onClick={() => onTableClick?.('T02')}
          className="absolute w-[54px] h-[54px] rounded-[50%] border-[7px] border-white shadow-[0_12px_0_#b8a783,0_18px_18px_#66573c35] grid place-items-center text-[10px] font-black text-[#4e5c50] cursor-pointer animate-table-bob hover:scale-110 transition-transform"
          style={{
            left: '58%',
            top: '18%',
            transform: 'translateZ(20px)',
            background: 'linear-gradient(145deg, #f7c0a5, #dc815f)',
            animationDelay: '-1.4s',
          }}
        >
          T02
        </div>

        {/* Iso Table 3 */}
        <div
          onClick={() => onTableClick?.('T03')}
          className="absolute w-[54px] h-[54px] rounded-[50%] border-[7px] border-white shadow-[0_12px_0_#b8a783,0_18px_18px_#66573c35] grid place-items-center text-[10px] font-black text-[#4e5c50] cursor-pointer animate-table-bob hover:scale-110 transition-transform"
          style={{
            left: '32%',
            top: '58%',
            transform: 'translateZ(20px)',
            background: 'linear-gradient(145deg, #fff9e9, #d8c6a1)',
          }}
        >
          T03
        </div>

        {/* Iso Table 4 */}
        <div
          onClick={() => onTableClick?.('T04')}
          className="absolute w-[54px] h-[54px] rounded-[50%] border-[7px] border-white shadow-[0_12px_0_#b8a783,0_18px_18px_#66573c35] grid place-items-center text-[10px] font-black text-[#4e5c50] cursor-pointer animate-table-bob hover:scale-110 transition-transform"
          style={{
            left: '74%',
            top: '61%',
            transform: 'translateZ(20px)',
            background: 'linear-gradient(145deg, #f7c0a5, #dc815f)',
            animationDelay: '-1.4s',
          }}
        >
          T04
        </div>
      </div>

      <div className="absolute left-[8%] bottom-[10px] bg-[#fffefa] border border-[#eee4d2] rounded-[12px] px-3 py-2 shadow-[0_13px_28px_#5b43231c] text-[10px] font-extrabold pointer-events-none">
        Dining room
        <span className="block text-[#8a938b] text-[8px] font-semibold mt-0.5">
          Interactive isometric view
        </span>
      </div>
    </div>
  );
};
