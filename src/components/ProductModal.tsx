import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';
import { formatCLP } from '../data/menu';
import { X, Plus, Minus, Check, Utensils, MessageSquare } from 'lucide-react';

interface ProductModalProps {
  item: MenuItem | null;
  menuItems?: MenuItem[];
  onClose: () => void;
  onAddToCart: (cartItem: Omit<CartItem, 'cartItemId'>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  menuItems = [],
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedCheese, setSelectedCheese] = useState<'Queso Chanco' | 'Queso Cheddar'>('Queso Chanco');
  const [bundleCounts, setBundleCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [imageError, setImageError] = useState(false);

  const isBundle = Boolean(
    item.bundleConfig?.enabled &&
    item.bundleConfig.allowedItemIds &&
    item.bundleConfig.allowedItemIds.length > 0
  );
  const requiredBundleCount = item.bundleConfig?.maxSelections || 1;

  const allowedBundleProducts = isBundle
    ? menuItems.filter((m) => item.bundleConfig?.allowedItemIds.includes(m.id))
    : [];

  useEffect(() => {
    setQuantity(1);
    setSelectedCheese('Queso Chanco');
    setBundleCounts({});
    setNotes('');
    setImageError(false);
  }, [item]);

  const totalBundleSelected = Object.values(bundleCounts).reduce((a, b) => a + b, 0);
  const isBundleComplete = !isBundle || totalBundleSelected === requiredBundleCount;

  const handleUpdateBundleCount = (itemId: string, delta: number) => {
    setBundleCounts((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const otherTotal = Object.entries(prev)
        .filter(([id]) => id !== itemId)
        .reduce((sum, [, count]) => sum + count, 0);

      if (delta > 0 && otherTotal + next > requiredBundleCount) {
        return prev;
      }

      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const unitPrice = item.price;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (!isBundleComplete) return;

    const selectedBundleItems = Object.entries(bundleCounts)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const found = menuItems.find((m) => m.id === id);
        return {
          itemId: id,
          name: found ? found.name : id,
          quantity: count,
        };
      });

    onAddToCart({
      item,
      quantity,
      selectedCheese: item.hasCheeseSelection ? selectedCheese : undefined,
      selectedBundleItems: selectedBundleItems.length > 0 ? selectedBundleItems : undefined,
      extraOptions: [],
      notes: notes.trim() || undefined,
      unitPrice,
      totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 bg-stone-900/70 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Header */}
        <div className="relative h-52 sm:h-60 w-full bg-stone-100 overflow-hidden shrink-0">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <Utensils className="w-10 h-10 mb-2" />
              <p className="font-bold text-stone-700">{item.name}</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-black/20" />

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h2 className="text-lg sm:text-2xl font-black text-white leading-snug font-display break-words">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed break-words">
              {item.description}
            </p>
          </div>

          {/* Bundle / Promo Selection (e.g. 2x1, choose 2 burgers) */}
          {isBundle && (
            <div className="border-2 border-amber-400 rounded-2xl p-3 sm:p-4 bg-amber-50/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <label className="text-xs sm:text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-1.5 break-words">
                    <span>🎁 {item.bundleConfig?.title || 'Elige tus productos:'}</span>
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Selecciona exactamente <strong className="font-bold text-stone-900">{requiredBundleCount}</strong> producto(s) para tu promoción.
                  </p>
                </div>
                <div className={`self-start px-2.5 py-1 rounded-full text-xs font-black font-mono shrink-0 border ${
                  totalBundleSelected === requiredBundleCount
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-amber-400 text-stone-950 border-amber-500 shadow-2xs'
                }`}>
                  {totalBundleSelected} / {requiredBundleCount}
                </div>
              </div>

              {/* List of allowed items to pick from */}
              <div className="space-y-2.5 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
                {allowedBundleProducts.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white rounded-xl border border-stone-200">
                    No hay productos configurados para esta promoción.
                  </p>
                ) : (
                  allowedBundleProducts.map((prod) => {
                    const count = bundleCounts[prod.id] || 0;
                    const canAddMore = totalBundleSelected < requiredBundleCount;

                    return (
                      <div
                        key={prod.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                          count > 0
                            ? 'bg-amber-50/70 border-amber-500 shadow-xs ring-1 ring-amber-400/50'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200 shadow-2xs mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-950 leading-snug break-words">
                              {prod.name}
                            </h4>
                            {prod.description && (
                              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mt-1 break-words">
                                {prod.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stepper for this choice */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                          <span className="text-[11px] font-bold text-stone-500 sm:hidden">
                            Cantidad:
                          </span>
                          <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateBundleCount(prod.id, -1)}
                              disabled={count === 0}
                              className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 text-stone-700 disabled:opacity-30 transition-colors cursor-pointer"
                              aria-label="Quitar uno"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-xs text-stone-900 tabular-nums">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateBundleCount(prod.id, 1)}
                              disabled={!canAddMore}
                              className="w-8 h-8 flex items-center justify-center hover:bg-amber-300 text-stone-900 disabled:opacity-30 transition-colors cursor-pointer"
                              aria-label="Agregar uno"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {!isBundleComplete && (
                <div className="text-xs text-amber-950 font-bold bg-amber-100/90 p-2.5 rounded-xl border border-amber-300 flex items-center gap-1.5 leading-normal">
                  <span>⚠️ Elige {requiredBundleCount - totalBundleSelected} producto(s) más para agregar al pedido.</span>
                </div>
              )}
            </div>
          )}

          {/* Cheese Selection (if applicable) */}
          {item.hasCheeseSelection && (
            <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-stone-800 tracking-wider">
                  Elige tu queso favorito:
                </label>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Requerido
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['Queso Chanco', 'Queso Cheddar'] as const).map((cheese) => {
                  const isChecked = selectedCheese === cheese;
                  return (
                    <button
                      key={cheese}
                      type="button"
                      onClick={() => setSelectedCheese(cheese)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-amber-400/20 border-amber-500 text-stone-950 shadow-xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>🧀 {cheese}</span>
                      {isChecked && <Check className="w-4 h-4 text-amber-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Product custom note input */}
          <div className="space-y-1.5 bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5">
            <label className="text-xs font-black uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Nota para este producto (opcional):</span>
            </label>
            <p className="text-[11px] text-stone-500">
              ¿Deseas personalizar algún ingrediente o preparación? Escríbelo aquí:
            </p>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, sin mayonesa, carne bien cocida, salsas aparte..."
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-amber-300 flex items-center justify-between gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Stepper */}
          <div className="flex items-center border border-amber-300 rounded-xl bg-white shadow-2xs overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-stone-700 hover:bg-amber-50 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Restar uno"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono font-black text-sm tabular-nums text-stone-950">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-stone-700 hover:bg-amber-50 transition-colors cursor-pointer"
              aria-label="Sumar uno"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            onClick={handleAdd}
            disabled={!isBundleComplete}
            className={`flex-1 font-black text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-between ${
              !isBundleComplete
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-950 cursor-pointer'
            }`}
          >
            <span>
              {!isBundleComplete
                ? `Elige ${requiredBundleCount - totalBundleSelected} más`
                : 'Agregar al Carrito'}
            </span>
            <span className="font-mono tabular-nums">{formatCLP(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
