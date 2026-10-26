import React, { useState } from 'react';
import { DISPLAY_PHONE } from '../data/menu';
import { CheckCircle2, MessageSquare, Copy, Check, RotateCcw } from 'lucide-react';

interface OrderSuccessScreenProps {
  whatsappUrl: string;
  messageText: string;
  onNewOrder: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  whatsappUrl,
  messageText,
  onNewOrder,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-mono font-black bg-amber-400 text-stone-950 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            Retiro en Tienda
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-950 mt-2 font-display">
            ¡Pedido Listo para WhatsApp!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
            Hemos preparado el pedido completo para enviarlo a <strong>Los Chavales</strong> (Sandwicheria de barrio) al número{' '}
            <strong className="text-stone-900 font-mono">{DISPLAY_PHONE}</strong>.
          </p>
        </div>

        {/* Action button to open WhatsApp */}
        <div className="space-y-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Abrir WhatsApp para Enviar</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Mensaje copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Copiar texto del pedido</span>
              </>
            )}
          </button>
        </div>

        {/* Message preview container */}
        <div className="text-left bg-white border-2 border-amber-300 rounded-2xl p-3.5 max-h-44 overflow-y-auto text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed shadow-2xs">
          {messageText}
        </div>

        {/* Reset button */}
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={onNewOrder}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors py-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Realizar otro pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
