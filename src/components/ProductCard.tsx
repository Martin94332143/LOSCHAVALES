import React, { useState } from 'react';
import { MenuItem } from '../types';
import { formatCLP } from '../data/menu';
import { Plus, Check, Utensils } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onSelectProduct: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAvailable = item.isAvailable !== false;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    onSelectProduct(item);
  };

  return (
    <article
      onClick={() => isAvailable && onSelectProduct(item)}
      className={`bg-white rounded-2xl p-4 sm:p-4.5 border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex gap-3.5 sm:gap-4 group relative ${
        isAvailable ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
      }`}
    >
      {/* Content info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-extrabold text-stone-950 text-base sm:text-lg leading-snug group-hover:text-amber-600 transition-colors font-display break-words">
              {item.name}
            </h3>
            {item.bundleConfig?.enabled && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shadow-2xs border border-amber-500 shrink-0">
                🎁 Elige {item.bundleConfig.maxSelections}
              </span>
            )}
            {!isAvailable && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                Agotado
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-stone-600 mt-1.5 leading-relaxed break-words line-clamp-3 sm:line-clamp-none">
            {item.description}
          </p>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-stone-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
              Precio
            </span>
            <span className="text-base sm:text-lg font-black text-stone-950 font-mono tabular-nums">
              {formatCLP(item.price)}
            </span>
          </div>

          {isAvailable ? (
            <button
              onClick={handleAddClick}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agregado</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs font-semibold text-stone-400 px-2 py-1">
              No disponible
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 relative">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-stone-100 text-stone-400 text-center">
            <Utensils className="w-6 h-6 mb-1 text-stone-400" />
            <span className="text-[10px] font-medium leading-tight text-stone-500">
              {item.name}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
