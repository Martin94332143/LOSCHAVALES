import React, { useState } from 'react';
import { CartItem, CustomerInfo } from '../types';
import { formatCLP } from '../data/menu';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Store,
  ChevronRight,
  AlertCircle,
  User,
  MessageSquare,
  Edit3,
  Check,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  customer: CustomerInfo;
  onUpdateCustomer: (customer: CustomerInfo) => void;
  onRequestConfirmation: () => void;
  onUpdateItemNotes?: (cartItemId: string, notes: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customer,
  onUpdateCustomer,
  onRequestConfirmation,
  onUpdateItemNotes,
}) => {
  if (!isOpen) return null;

  const [nameError, setNameError] = useState('');
  const [editingNoteItemId, setEditingNoteItemId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleNameChange = (val: string) => {
    onUpdateCustomer({
      ...customer,
      name: val,
    });
    if (nameError) setNameError('');
  };

  const handleProceedToConfirmation = () => {
    if (!customer.name.trim()) {
      setNameError('Por favor ingresa tu nombre para retirar el pedido');
      return;
    }
    onRequestConfirmation();
  };

  const startEditNote = (cartItemId: string, currentNote?: string) => {
    setEditingNoteItemId(cartItemId);
    setTempNoteText(currentNote || '');
  };

  const saveItemNote = (cartItemId: string) => {
    onUpdateItemNotes?.(cartItemId, tempNoteText);
    setEditingNoteItemId(null);
  };

  const cancelEditNote = () => {
    setEditingNoteItemId(null);
    setTempNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-amber-400 flex items-center justify-between bg-white text-stone-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display text-stone-950">Tu Pedido</h2>
              <p className="text-[11px] text-stone-500 font-medium">
                {items.length === 0
                  ? 'Carrito vacío (0 CLP)'
                  : `${items.reduce((s, i) => s + i.quantity, 0)} productos para retiro`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-stone-500 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer font-semibold"
                title="Vaciar carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State - explicitly 0 CLP */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-4">
              🍔
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg mb-1 font-display">
              Tu carrito está en 0 CLP
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mb-6">
              Aún no has agregado productos. Selecciona tus hamburguesas o mechadas favoritas para retirar en tienda.
            </p>
            <button
              onClick={onClose}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow transition-all cursor-pointer"
            >
              Ver Carta Menú
            </button>
          </div>
        ) : (
          /* Cart Content with items and Name input only */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Store Pickup Only Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950 font-bold">
              <Store className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Modalidad: Retiro en tienda (Local)</span>
            </div>

            {/* Itemized List */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                Productos ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              <div className="space-y-2">
                {items.map((ci) => {
                  const isEditingThisNote = editingNoteItemId === ci.cartItemId;

                  return (
                    <div
                      key={ci.cartItemId}
                      className="p-3 bg-stone-50 border border-stone-200/90 rounded-2xl flex flex-col gap-2 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-stone-900 text-sm leading-snug break-words">
                              {ci.item.name}
                            </h4>
                            {ci.quantity > 1 && (
                              <span className="bg-amber-400 text-stone-950 font-black text-xs px-2 py-0.5 rounded-full font-mono border border-amber-500 shadow-2xs">
                                x{ci.quantity}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono font-semibold text-stone-600">
                            {formatCLP(ci.unitPrice)} c/u
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(ci.cartItemId)}
                          className="text-stone-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {ci.selectedCheese && (
                        <p className="text-[11px] text-amber-800 font-medium">
                          🧀 Queso: {ci.selectedCheese}
                        </p>
                      )}

                      {ci.selectedBundleItems && ci.selectedBundleItems.length > 0 && (
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 space-y-1">
                          <span className="text-[10px] font-black uppercase text-amber-900 block tracking-wider">
                            📦 Incluye {ci.quantity > 1 ? `(${ci.quantity} promociones)` : ''}:
                          </span>
                          <div className="space-y-1">
                            {ci.selectedBundleItems.map((b, bIdx) => (
                              <p key={bIdx} className="text-xs font-semibold text-stone-800 flex items-start gap-1.5 leading-snug">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                <span className="break-words flex-1">
                                  {ci.quantity > 1
                                    ? `${b.quantity * ci.quantity}x ${b.name} (${b.quantity} por promo)`
                                    : `${b.quantity}x ${b.name}`}
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Note display & inline editor per item */}
                      {isEditingThisNote ? (
                        <div className="bg-white border border-amber-300 rounded-xl p-2 space-y-1.5 shadow-2xs">
                          <label className="text-[10px] font-bold text-amber-900 block">
                            Nota para {ci.item.name}:
                          </label>
                          <input
                            type="text"
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Ej: Sin cebolla, bien cocido, sin salsa..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveItemNote(ci.cartItemId);
                              if (e.key === 'Escape') cancelEditNote();
                            }}
                          />
                          <div className="flex justify-end gap-1.5 pt-0.5">
                            <button
                              type="button"
                              onClick={cancelEditNote}
                              className="text-[11px] text-stone-500 hover:text-stone-700 px-2 py-0.5 rounded cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => saveItemNote(ci.cartItemId)}
                              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Guardar</span>
                            </button>
                          </div>
                        </div>
                      ) : ci.notes ? (
                        <div className="flex items-center justify-between gap-1.5 bg-amber-50/70 p-2 rounded-xl border border-amber-200/50">
                          <p className="text-[11px] text-amber-900 font-medium italic min-w-0 flex-1 break-words">
                            📝 "{ci.notes}"
                          </p>
                          <button
                            type="button"
                            onClick={() => startEditNote(ci.cartItemId, ci.notes)}
                            className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-0.5 shrink-0 px-1 py-0.5 rounded cursor-pointer hover:bg-amber-100/60"
                            title="Editar nota del producto"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            onClick={() => startEditNote(ci.cartItemId, '')}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer py-0.5 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>+ Agregar nota a este producto</span>
                          </button>
                        </div>
                      )}

                      {/* Stepper and item total */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(ci.cartItemId, -1)}
                            className="p-1 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 font-mono font-bold text-xs tabular-nums text-stone-900">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(ci.cartItemId, 1)}
                            className="p-1 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-black text-sm text-stone-900 tabular-nums">
                          {formatCLP(ci.totalPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details Form: ONLY NAME as requested */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                Datos para Retirar
              </h3>

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Tu Nombre *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ingresa tu nombre..."
                      required
                      className={`w-full bg-stone-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 ${
                        nameError ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {nameError}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1">
                    Nombre con el que retirarás tu pedido en el mesón.
                  </p>
                </div>

                {/* Payment Method Selector (EFECTIVO o TRANSFERENCIA) */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Medio de Pago *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCustomer({ ...customer, paymentMethod: 'EFECTIVO' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        (customer.paymentMethod || 'EFECTIVO') === 'EFECTIVO'
                          ? 'bg-amber-400/20 border-amber-500 text-stone-950 shadow-xs ring-1 ring-amber-500'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-lg">💵</span>
                        {(customer.paymentMethod || 'EFECTIVO') === 'EFECTIVO' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
                        )}
                      </div>
                      <span className="text-xs font-black uppercase text-stone-900">Efectivo</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">Al retirar en tienda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCustomer({ ...customer, paymentMethod: 'TRANSFERENCIA' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        customer.paymentMethod === 'TRANSFERENCIA'
                          ? 'bg-amber-400/20 border-amber-500 text-stone-950 shadow-xs ring-1 ring-amber-500'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-lg">💳</span>
                        {customer.paymentMethod === 'TRANSFERENCIA' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
                        )}
                      </div>
                      <span className="text-xs font-black uppercase text-stone-900">Transferencia</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">Previa o al retirar</span>
                    </button>
                  </div>
                </div>

                {/* Optional note */}
                <div>
                  <label className="text-[11px] font-medium text-stone-600 block mb-1">
                    Comentario general del pedido (opcional):
                  </label>
                  <input
                    type="text"
                    value={customer.notes || ''}
                    onChange={(e) =>
                      onUpdateCustomer({ ...customer, notes: e.target.value })
                    }
                    placeholder="Ej: Llego en 20 minutos, servilletas extras..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Total and Proceed button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t-2 border-amber-300 bg-white space-y-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-stone-600">
                Total a pagar (Retiro):
              </span>
              <span className="font-mono text-amber-600 tabular-nums text-xl font-black">
                {formatCLP(total)}
              </span>
            </div>

            <button
              onClick={handleProceedToConfirmation}
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer"
            >
              <span>Confirmar Pedido</span>
              <div className="flex items-center gap-1 font-mono">
                <span>{formatCLP(total)}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
