import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCLP } from '../data/menu';

interface MobileCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white text-stone-900 px-4 py-2.5 sm:py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] border-t-2 border-amber-400 lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left: Bag icon + Total */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-amber-300 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-amber-400">
                {cartCount}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider leading-none">
              Tu Pedido
            </span>
            <span className="text-sm font-black text-stone-950 font-mono tabular-nums leading-tight">
              {formatCLP(cartTotal)}
            </span>
          </div>
        </div>

        {/* Right: Yellow button "Ver Carrito ->" */}
        <button
          onClick={onOpenCart}
          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer font-display"
        >
          <span>Ver Carrito</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
