import React from 'react';
import { useDineFlowStore } from '../../store/useDineFlowStore';

export const HeroPlate: React.FC = () => {
  const { device, activeTableNumber } = useDineFlowStore();
  const isMobile = device === 'mobile';

  return (
    <div className={`relative ${isMobile ? 'h-[205px] mt-2' : 'h-[260px]'} grid place-items-center [perspective:1000px] overflow-visible`}>
      {/* Orbit Ring */}
      <div
        className="absolute w-[285px] h-[135px] border border-dashed border-[#d7b77e] rounded-[50%] animate-orbit"
        style={{ transform: 'rotate(-24deg)' }}
      />

      {/* Plate Rig */}
      <div
        className={`relative w-[235px] h-[210px] [transform-style:preserve-3d] ${
          isMobile ? 'animate-plate-mobile' : 'animate-plate'
        }`}
      >
        {/* Plate Shadow */}
        <div
          className="absolute w-[230px] h-[190px] rounded-[50%] bg-[#a77a4933] blur-[13px]"
          style={{ transform: 'translateZ(-22px) translate(10px, 20px)' }}
        />

        {/* Plate Base */}
        <div
          className="absolute inset-[8px_13px_12px] rounded-[50%] border-[8px] border-white shadow-[0_15px_25px_#5e4a2c22,inset_0_0_0_2px_#d9d1c2]"
          style={{ background: 'linear-gradient(145deg, #fff, #e7e1d3)' }}
        />

        {/* Plate Food */}
        <div
          className="absolute left-1/2 top-1/2 w-[125px] h-[125px] rounded-[50%] shadow-[inset_0_0_0_6px_#fff5d9,0_9px_15px_#65452d44]"
          style={{
            transform: 'translate(-50%, -50%) translateZ(14px)',
            background:
              'radial-gradient(circle at 35% 35%, #ffcf80 0 10%, #e86b3e 11% 35%, #a34b2c 36% 54%, #e5b15e 55% 67%, #73934f 68% 76%, #e9c18b 77%)',
          }}
        />

        {/* Plate Leaf */}
        <div
          className="absolute left-[46%] top-[37%] w-[35px] h-[15px] rounded-[100%_0_100%_0] bg-[#5b8b51]"
          style={{ transform: 'translateZ(35px) rotate(-25deg)' }}
        />
      </div>

      {/* Floating Tag 1 */}
      <div
        className="absolute bg-[#fffefa] border border-[#eee4d2] rounded-[12px] px-3 py-2 shadow-[0_13px_28px_#5b43231c] text-[10px] font-extrabold animate-float-tag pointer-events-none"
        style={{ top: '17px', left: '2%', animationDelay: '-1.1s' }}
      >
        ✦ Made to order
        <span className="block text-[#8a938b] text-[8px] font-semibold mt-0.5">
          Fresh from our kitchen
        </span>
      </div>

      {/* Floating Tag 2 */}
      <div
        className="absolute bg-[#fffefa] border border-[#eee4d2] rounded-[12px] px-3 py-2 shadow-[0_13px_28px_#5b43231c] text-[10px] font-extrabold animate-float-tag pointer-events-none"
        style={{ right: '0', top: '46%', animationDelay: '-2.3s' }}
      >
        18 min
        <span className="block text-[#8a938b] text-[8px] font-semibold mt-0.5">
          Average preparation
        </span>
      </div>

      {/* Floating Tag 3 */}
      <div
        className="absolute bg-[#fffefa] border border-[#eee4d2] rounded-[12px] px-3 py-2 shadow-[0_13px_28px_#5b43231c] text-[10px] font-extrabold animate-float-tag pointer-events-none"
        style={{ bottom: '9px', left: '15%', animationDelay: '-0.4s' }}
      >
        {activeTableNumber} · Your table
        <span className="block text-[#8a938b] text-[8px] font-semibold mt-0.5">
          Order without waiting
        </span>
      </div>
    </div>
  );
};
