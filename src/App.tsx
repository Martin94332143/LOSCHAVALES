/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, CustomerInfo, CategoryId, Category, BundleSelection } from './types';
import {
  MENU_ITEMS,
  INITIAL_CATEGORIES,
  WHATSAPP_PHONE,
  DISPLAY_PHONE,
  formatCLP,
  STORE_NAME,
  STORE_SLOGAN,
  STORE_LOGO,
} from './data/menu';
import { buildWhatsAppMessage, createWhatsAppUrl } from './utils/whatsapp';
import { Header } from './components/Header';
import { PromoHero } from './components/PromoHero';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderSuccessScreen } from './components/OrderSuccessScreen';
import { MobileCartBar } from './components/MobileCartBar';
import { AdminModal } from './components/AdminModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Categories state (persisted locally)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('el_chaval_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Menu items state (persisted locally so admin edits survive reloads)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('el_chaval_custom_menu');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  // Admin modal open/close
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Cart and user state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todos'>('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Success state after WhatsApp dispatch
  const [successOrder, setSuccessOrder] = useState<{
    whatsappUrl: string;
    messageText: string;
  } | null>(null);

  // Customer Checkout state (name and payment method for store pickup)
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    paymentMethod: 'EFECTIVO',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Menu updates from admin
  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => {
      const next = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      try {
        localStorage.setItem('el_chaval_custom_menu', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem('el_chaval_custom_menu', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`¡Producto "${newItem.name}" creado con éxito!`);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => {
      const deletedItem = prev.find((i) => i.id === itemId);
      const next = prev.filter((i) => i.id !== itemId);
      try {
        localStorage.setItem('el_chaval_custom_menu', JSON.stringify(next));
      } catch {}
      if (deletedItem) {
        showToast(`Producto "${deletedItem.name}" eliminado de la carta`);
      }
      return next;
    });
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => {
      const next = [...prev, newCat];
      try {
        localStorage.setItem('el_chaval_categories', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`¡Categoría "${newCat.label}" creada!`);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== catId);
      try {
        localStorage.setItem('el_chaval_categories', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === categoryId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

      try {
        localStorage.setItem('el_chaval_categories', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMoveMenuItem = (itemId: string, direction: 'up' | 'down') => {
    setMenuItems((prev) => {
      const index = prev.findIndex((i) => i.id === itemId);
      if (index === -1) return prev;

      const currentItem = prev[index];
      const sameCategoryIndices = prev
        .map((item, idx) => (item.category === currentItem.category ? idx : -1))
        .filter((idx) => idx !== -1);

      const posInCat = sameCategoryIndices.indexOf(index);
      if (direction === 'up' && posInCat <= 0) return prev;
      if (direction === 'down' && posInCat >= sameCategoryIndices.length - 1) return prev;

      const targetIndex = direction === 'up'
        ? sameCategoryIndices[posInCat - 1]
        : sameCategoryIndices[posInCat + 1];

      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      try {
        localStorage.setItem('el_chaval_custom_menu', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleResetMenu = () => {
    setMenuItems(MENU_ITEMS);
    setCategories(INITIAL_CATEGORIES);
    try {
      localStorage.removeItem('el_chaval_custom_menu');
      localStorage.removeItem('el_chaval_categories');
    } catch {}
    showToast('Carta restablecida a los valores originales');
  };

  // Cart operations
  const handleAddToCart = (newItem: Omit<CartItem, 'cartItemId'>) => {
    setCart((prev) => {
      // Find if an identical item is already in the cart
      const existingIndex = prev.findIndex((ci) => {
        // 1. Same base menu item
        if (ci.item.id !== newItem.item.id) return false;

        // 2. Same cheese selection
        if ((ci.selectedCheese || '') !== (newItem.selectedCheese || '')) return false;

        // 3. Same bundle selections (e.g. 2x1 burger choices)
        const serializeBundle = (bundle?: BundleSelection[]) => {
          if (!bundle || bundle.length === 0) return '';
          return [...bundle]
            .filter((b) => b.quantity > 0)
            .sort((a, b) => a.itemId.localeCompare(b.itemId))
            .map((b) => `${b.itemId}:${b.quantity}`)
            .join('|');
        };

        if (serializeBundle(ci.selectedBundleItems) !== serializeBundle(newItem.selectedBundleItems)) {
          return false;
        }

        // 4. Same notes
        const noteCi = (ci.notes || '').trim().toLowerCase();
        const noteNew = (newItem.notes || '').trim().toLowerCase();
        if (noteCi !== noteNew) {
          return false;
        }

        return true;
      });

      if (existingIndex !== -1) {
        // Update existing item: sum quantities and recalculate total
        const updated = [...prev];
        const existing = updated[existingIndex];
        const nextQuantity = existing.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: nextQuantity,
          totalPrice: existing.unitPrice * nextQuantity,
        };
        return updated;
      }

      // If new, assign a unique cartItemId and append
      const cartItemId = `${newItem.item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      return [...prev, { ...newItem, cartItemId }];
    });

    showToast(`¡${newItem.item.name} agregado al carrito!`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart({
      item,
      quantity: 1,
      extraOptions: [],
      unitPrice: item.price,
      totalPrice: item.price,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const nextQty = ci.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...ci,
              quantity: nextQty,
              totalPrice: ci.unitPrice * nextQty,
            };
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateItemNotes = (cartItemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.cartItemId === cartItemId ? { ...ci, notes: notes.trim() || undefined } : ci
      )
    );
  };

  // Calculations (Default 0 CLP when empty, pickup only with no delivery fee)
  const cartGrandTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.totalPrice, 0),
    [cart]
  );
  const cartTotalItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Filtered menu items by active category tab
  const visibleCategories = useMemo(() => {
    if (selectedCategory === 'todos') {
      return categories.filter((cat) => menuItems.some((i) => i.category === cat.id));
    }
    return categories.filter((cat) => cat.id === selectedCategory);
  }, [categories, menuItems, selectedCategory]);

  // When user clicks "Confirmar y Enviar Pedido" in the Cart Drawer
  const handleRequestConfirmation = () => {
    setIsConfirmModalOpen(true);
  };

  // When user explicitly confirms in the confirmation dialog
  const handleConfirmAndSendToWhatsApp = () => {
    const message = buildWhatsAppMessage(
      cart,
      cartGrandTotal,
      customer
    );
    const whatsappUrl = createWhatsAppUrl(message, WHATSAPP_PHONE);

    // Open WhatsApp URL directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Show order success screen
    setSuccessOrder({
      whatsappUrl,
      messageText: message,
    });

    // Close drawers and modals
    setIsConfirmModalOpen(false);
    setIsCartOpen(false);
  };

  const handleStartNewOrder = () => {
    setSuccessOrder(null);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 pb-24 lg:pb-12 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-amber-400 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={cartTotalItemsCount}
        cartTotal={cartGrandTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Promotional Fries Banner without search */}
      <PromoHero />

      {/* Category Navigation Pills */}
      <CategoryNav
        categories={categories}
        menuItems={menuItems}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Menu Catalog Section */}
      <main className="max-w-6xl mx-auto px-4 py-6 w-full flex-1 space-y-10">
        {visibleCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <h3 className="font-extrabold text-stone-900 text-lg mb-1 font-display">
              No hay productos en esta categoría
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              Aún no se han agregado productos a esta sección o fueron removidos.
            </p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs cursor-pointer"
            >
              Ver toda la carta
            </button>
          </div>
        ) : (
          visibleCategories.map((category) => {
            const itemsInCat = menuItems.filter((i) => i.category === category.id);
            if (itemsInCat.length === 0) return null;

            return (
              <section key={category.id} id={category.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-300 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon || '🍽️'}</span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-950 font-display">
                      {category.label}
                    </h2>
                  </div>

                  <span className="self-start sm:self-auto bg-amber-400 text-stone-950 font-black text-[11px] px-2.5 py-1 rounded-lg shadow-2xs">
                    {itemsInCat.length} Variedades
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {itemsInCat.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onSelectProduct={setSelectedProduct}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Footer info */}
      <footer className="mt-12 bg-white text-stone-700 text-xs py-7 px-4 border-t-2 border-amber-300 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 p-0.5 flex items-center justify-center shadow-2xs shrink-0">
              <img
                src={STORE_LOGO}
                alt={STORE_NAME}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-black text-stone-950 font-display text-sm">
                {STORE_NAME}
              </div>
              <div className="text-[11px] text-stone-500 font-semibold">
                {STORE_SLOGAN}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div>
              <span className="text-stone-600 font-medium">Pedidos directos por WhatsApp: </span>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-950 font-mono font-black hover:text-amber-600 ml-1 underline decoration-amber-400 decoration-2 underline-offset-2"
              >
                {DISPLAY_PHONE}
              </a>
            </div>
            <div>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer text-xs font-medium"
              >
                Panel
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed bottom checkout bar for mobile */}
      <MobileCartBar
        cartCount={cartTotalItemsCount}
        cartTotal={cartGrandTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Product Customization Modal */}
      <ProductModal
        item={selectedProduct}
        menuItems={menuItems}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer (Pickup only) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        customer={customer}
        onUpdateCustomer={setCustomer}
        onRequestConfirmation={handleRequestConfirmation}
        onUpdateItemNotes={handleUpdateItemNotes}
      />

      {/* Explicit Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAndSendToWhatsApp}
        items={cart}
        customer={customer}
        total={cartGrandTotal}
      />

      {/* Order Success / Dispatched Screen */}
      {successOrder && (
        <OrderSuccessScreen
          whatsappUrl={successOrder.whatsappUrl}
          messageText={successOrder.messageText}
          onNewOrder={handleStartNewOrder}
        />
      )}

      {/* Admin Panel Modal (Usuario: Chaval2026 / Contraseña: chavaladmin26) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        menuItems={menuItems}
        categories={categories}
        onUpdateMenuItem={handleUpdateMenuItem}
        onAddMenuItem={handleAddMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onMoveCategory={handleMoveCategory}
        onMoveMenuItem={handleMoveMenuItem}
        onResetMenu={handleResetMenu}
      />
    </div>
  );
}
