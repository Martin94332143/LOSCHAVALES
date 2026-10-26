import React from 'react';
import { CartItem, CustomerInfo } from '../types';
import { formatCLP, DISPLAY_PHONE } from '../data/menu';
import {
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  Store,
  User,
} from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  customer,
  total,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning / Confirmation Banner */}
        <div className="bg-amber-400 p-4 sm:p-5 text-stone-950 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-stone-950 text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-stone-950 text-amber-300 px-2 py-0.5 rounded-full inline-block mb-1">
              Confirmación de Pedido
            </span>
            <h2 className="text-lg sm:text-xl font-black leading-tight font-display">
              ¿Realmente quieres pedir esto?
            </h2>
            <p className="text-xs text-stone-900/90 mt-1">
              Revisa el resumen final para retiro en tienda antes de enviarlo directamente a{' '}
              <strong>Los Chavales</strong> (Sandwicheria de barrio) por WhatsApp.
            </p>
          </div>
        </div>

        {/* Scrollable Summary */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-800 flex-1">
          {/* Customer & Store Pickup Card */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 border-b border-stone-200/60 pb-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Cliente: {customer.name}</span>
            </div>

            <div className="flex items-center justify-between text-stone-700 flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">Modalidad: Retiro en tienda</span>
              </div>
              <span className="text-xs font-black uppercase bg-amber-200/80 text-stone-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                {customer.paymentMethod === 'TRANSFERENCIA' ? '💳 Transferencia' : '💵 Efectivo'}
              </span>
            </div>

            {customer.notes && (
              <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/60">
                💬 Comentario: "{customer.notes}"
              </p>
            )}
          </div>

          {/* Items breakdown list */}
          <div>
            <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider mb-2">
              Productos seleccionados ({items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl bg-white overflow-hidden">
              {items.map((ci) => (
                <div key={ci.cartItemId} className="p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 font-bold text-stone-900 text-xs sm:text-sm">
                      <span className="text-amber-600">{ci.quantity}x</span>
                      <span>{ci.item.name}</span>
                    </div>

                    {ci.selectedBundleItems && ci.selectedBundleItems.length > 0 && (
                      <p className="text-[11px] text-stone-700 pl-4 font-medium">
                        📦 Incluye: {ci.selectedBundleItems.map((b) => `${b.quantity}x ${b.name}`).join(', ')}
                      </p>
                    )}

                    {ci.selectedCheese && (
                      <p className="text-[11px] text-stone-500 pl-4">
                        🧀 Queso: {ci.selectedCheese}
                      </p>
                    )}

                    {ci.extraOptions.length > 0 && (
                      <p className="text-[11px] text-stone-500 pl-4">
                        ➕ Extras: {ci.extraOptions.map((e) => e.name).join(', ')}
                      </p>
                    )}

                    {ci.notes && (
                      <p className="text-[11px] text-amber-700 italic pl-4">
                        📝 "{ci.notes}"
                      </p>
                    )}
                  </div>

                  <span className="font-mono font-bold text-stone-900 tabular-nums shrink-0 text-xs sm:text-sm">
                    {formatCLP(ci.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 space-y-1.5 font-medium">
            <div className="flex justify-between text-stone-950 font-black text-base">
              <span>Total a pagar (Retiro):</span>
              <span className="font-mono text-amber-600 tabular-nums text-lg">
                {formatCLP(total)}
              </span>
            </div>
          </div>

          {/* WhatsApp Destination Notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span>El pedido se enviará al WhatsApp oficial: </span>
              <strong className="font-mono">{DISPLAY_PHONE}</strong>
            </div>
          </div>
        </div>

        {/* Confirmation buttons */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-amber-300 flex flex-col sm:flex-row items-center gap-2.5 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Modificar</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Sí, Confirmar y Enviar a WhatsApp!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
