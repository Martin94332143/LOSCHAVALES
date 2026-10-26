export type CategoryId = string;

export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA';

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface BundleConfig {
  enabled: boolean;
  maxSelections: number; // e.g. 2 for 2x1
  allowedItemIds: string[]; // List of MenuItem IDs selectable by customer
  title?: string; // Optional custom prompt, e.g. "Elige tus 2 hamburguesas"
}

export interface BundleSelection {
  itemId: string;
  name: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  image: string;
  hasCheeseSelection?: boolean;
  bundleConfig?: BundleConfig;
  isPopular?: boolean;
  isAvailable?: boolean;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedCheese?: 'Queso Chanco' | 'Queso Cheddar';
  selectedBundleItems?: BundleSelection[];
  extraOptions: ExtraOption[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerInfo {
  name: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}
