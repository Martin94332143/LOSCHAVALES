import { CartItem, CustomerInfo } from '../types';
import { formatCLP, WHATSAPP_PHONE } from '../data/menu';

export function buildWhatsAppMessage(
  items: CartItem[],
  total: number,
  customer: CustomerInfo
): string {
  const lines: string[] = [];
  lines.push(`¡Hola! Acabo de hacer este pedido por la web:`);
  lines.push(``);
  lines.push(`🍔 *PEDIDO - LOS CHAVALES* 🥪`);
  lines.push(`*Sandwicheria de barrio*`);
  lines.push(`--------------------------------`);
  lines.push(`👤 *Cliente:* ${customer.name}`);
  lines.push(`🛍️ *Modalidad:* Retiro en tienda (Local)`);
  lines.push(`💰 *Medio de Pago:* ${customer.paymentMethod === 'TRANSFERENCIA' ? 'TRANSFERENCIA' : 'EFECTIVO'}`);
  lines.push(``);
  lines.push(`📋 *DETALLE DEL PEDIDO:*`);

  items.forEach((ci, idx) => {
    lines.push(`${idx + 1}. *${ci.quantity}x ${ci.item.name}* (${formatCLP(ci.totalPrice)})`);
    if (ci.selectedBundleItems && ci.selectedBundleItems.length > 0) {
      const bundleStr = ci.selectedBundleItems
        .map((b) =>
          ci.quantity > 1
            ? `${b.quantity * ci.quantity}x ${b.name} (${b.quantity} por promo)`
            : `${b.quantity}x ${b.name}`
        )
        .join(', ');
      lines.push(`   └ 📦 Incluye: ${bundleStr}`);
    }
    if (ci.selectedCheese) {
      lines.push(`   └ 🧀 Queso: ${ci.selectedCheese}`);
    }
    if (ci.extraOptions.length > 0) {
      const extrasStr = ci.extraOptions.map((e) => `+ ${e.name} (${formatCLP(e.price)})`).join(', ');
      lines.push(`   └ ➕ Extras: ${extrasStr}`);
    }
    if (ci.notes && ci.notes.trim()) {
      lines.push(`   └ 📝 ${ci.notes.trim()}`);
    }
  });

  lines.push(`--------------------------------`);
  lines.push(`*TOTAL A PAGAR: ${formatCLP(total)} CLP*`);
  lines.push(`--------------------------------`);

  if (customer.notes && customer.notes.trim()) {
    lines.push(`💬 *Comentarios:* ${customer.notes.trim()}`);
    lines.push(`--------------------------------`);
  }

  lines.push(`¿Podrían confirmarme la recepción y tiempo estimado para el retiro? ¡Muchas gracias! 😊`);

  return lines.join('\n');
}

export function createWhatsAppUrl(message: string, phone: string = WHATSAPP_PHONE): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '') || WHATSAPP_PHONE;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
