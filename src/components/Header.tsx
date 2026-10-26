import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatCLP, STORE_NAME, STORE_SLOGAN, STORE_LOGO } from '../data/menu';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white text-stone-900 shadow-xs border-b-2 border-amber-400">
      {/* Main navigation zone */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white border border-amber-300 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
            <img
              src={STORE_LOGO}
              alt={STORE_NAME}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 font-display">
                {STORE_NAME}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-stone-500 tracking-wide">
              {STORE_SLOGAN}
            </p>
          </div>
        </div>

        {/* Center navigation links (desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-600">
          <button
            onClick={() => onSelectCategory('hamburguesas')}
            className={`transition-colors hover:text-amber-600 ${
              activeCategory === 'hamburguesas' ? 'text-stone-950 font-extrabold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Hamburguesas
          </button>
          <button
            onClick={() => onSelectCategory('mechada')}
            className={`transition-colors hover:text-amber-600 ${
              activeCategory === 'mechada' ? 'text-stone-950 font-extrabold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Mechada
          </button>
          <button
            onClick={() => onSelectCategory('vegetarianos')}
            className={`transition-colors hover:text-amber-600 ${
              activeCategory === 'vegetarianos' ? 'text-stone-950 font-extrabold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Vegetarianos
          </button>
          <button
            onClick={() => onSelectCategory('bebestibles')}
            className={`transition-colors hover:text-amber-600 ${
              activeCategory === 'bebestibles' ? 'text-stone-950 font-extrabold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Bebidas
          </button>
        </nav>

        {/* Right CTA - Cart button */}
        <button
          onClick={onOpenCart}
          className="relative inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all shadow-xs hover:shadow-amber-400/30 active:scale-95 shrink-0 cursor-pointer"
          aria-label="Abrir carrito de compras"
        >
          <ShoppingBag className="w-5 h-5 text-stone-950" />
          <span className="hidden sm:inline font-extrabold">Tu Carrito</span>
          <span className="font-mono tabular-nums text-stone-950 font-black text-xs sm:text-sm bg-white/70 px-1.5 py-0.5 rounded shadow-2xs">
            {formatCLP(cartTotal)}
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-amber-300 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow border border-amber-400">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
