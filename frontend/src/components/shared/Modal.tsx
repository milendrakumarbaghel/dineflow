import React from 'react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[#14221dcc] grid place-items-center z-50 p-5 animate-[fadeIn_0.2s]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(460px,100%)] bg-[#fbfaf5] rounded-[20px] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-[#e5e4da]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-[18px] text-[#1d2925]">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#eeeae0] text-[#7b8980] flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 text-[12px] text-[#33423b] leading-relaxed">{children}</div>

        {footer && <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[#ece9df]">{footer}</div>}
      </div>
    </div>
  );
};
