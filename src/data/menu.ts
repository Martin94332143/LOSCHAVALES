import { MenuItem, ExtraOption } from '../types';

export const STORE_NAME = 'Los Chavales';
export const STORE_SLOGAN = 'Sandwicheria de barrio';
export const STORE_LOGO = '/assets/aistudio/WhatsApp_Image_2026-10-25_at_20.58.34_faeb3d07.jpeg';

export const WHATSAPP_PHONE = '56982587304';
export const DISPLAY_PHONE = '+56 9 8258 7304';
export const FREE_DELIVERY_THRESHOLD = 15000;
export const STANDARD_DELIVERY_FEE = 2500;

export const AVAILABLE_EXTRAS: ExtraOption[] = [
  { id: 'extra_papas', name: 'Porción extra de papas caseras', price: 2490 },
  { id: 'extra_mayo_casera', name: 'Salsa Mayo Casera de la casa (60ml)', price: 800 },
  { id: 'extra_mayo_pesto', name: 'Salsa Mayo Pesto artesanal (60ml)', price: 900 },
  { id: 'extra_salsa_bbq', name: 'Salsa BBQ ahumada (60ml)', price: 700 },
  { id: 'extra_pebre', name: 'Pebre criollo chileno fresco (60ml)', price: 800 },
  { id: 'extra_queso_fundido', name: 'Doble baño de Queso Cheddar fundido', price: 1490 },
  { id: 'extra_tocino', name: 'Láminas de Tocino Crocante extra', price: 1290 },
];

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // PROMOCIONES Y COMBOS
  // ==========================================
  {
    id: 'promo-2x1-hamburguesas',
    name: 'Promo 2x1 Hamburguesas',
    category: 'hamburguesas',
    price: 13990,
    description: '¡Elige 2 hamburguesas artesanales de nuestra selección a precio especial! Incluye papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
    isPopular: true,
    bundleConfig: {
      enabled: true,
      maxSelections: 2,
      allowedItemIds: [
        'hamb-campestre',
        'hamb-italiana',
        'hamb-chaval',
        'hamb-americana',
        'hamb-gringa',
        'hamb-tocino-bbq',
        'hamb-suprema-cheddar',
        'hamb-smash-doble',
      ],
      title: 'Elige tus 2 hamburguesas:',
    },
  },

  // ==========================================
  // HAMBURGUESAS ARTESANALES (10 Variedades)
  // ==========================================
  {
    id: 'hamb-campestre',
    name: 'Hamburguesa Campestre',
    category: 'hamburguesas',
    price: 8590,
    description: 'Hamburguesa de 150 gr con queso chanco, salteado de tomate, champiñones, aceituna, cebolla caramelizada y mayonesa casera.',
    image: '/src/assets/images/hamburguesa_artesanal_1792959834825.jpg',
    isPopular: true,
  },
  {
    id: 'hamb-italiana',
    name: 'Hamburguesa Italiana',
    category: 'hamburguesas',
    price: 7990,
    description: 'Hamburguesa de 150 gr con palta hass fresca en trozos, tomate seleccionado, mayonesa casera y papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
    isPopular: true,
  },
  {
    id: 'hamb-chaval',
    name: 'Hamburguesa Chaval',
    category: 'hamburguesas',
    price: 8590,
    description: 'Hamburguesa de 150 gr con queso chanco derretido, champiñones, pimentón asado, chorizo parrillero, mayonesa casera y papas fritas.',
    image: '/src/assets/images/hamburguesa_artesanal_1792959834825.jpg',
    isPopular: true,
  },
  {
    id: 'hamb-americana',
    name: 'Hamburguesa Americana',
    category: 'hamburguesas',
    price: 8590,
    description: 'Hamburguesa de 150 gr con pepinillos, queso cheddar, tocino crocante, cebolla caramelizada, huevo revuelto, 3 aros de cebolla, salsa BBQ y papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
  },
  {
    id: 'hamb-gringa',
    name: 'Hamburguesa Gringa',
    category: 'hamburguesas',
    price: 9290,
    description: 'Hamburguesa de 150 gr con lechuga, tomate, tocino, queso cheddar, huevos fritos, aros de cebolla, mayonesa casera, salsa bbq y papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
    isPopular: true,
  },
  {
    id: 'hamb-4-quesos',
    name: 'Hamburguesa 4 Quesos',
    category: 'hamburguesas',
    price: 8990,
    description: 'Hamburguesa de 150 gr con lechuga, tomate, fundición de queso chanco, cheddar, azul y philadelphia, mayo pesto y papas fritas.',
    image: '/src/assets/images/hamburguesa_artesanal_1792959834825.jpg',
  },
  {
    id: 'hamb-big-cheddar',
    name: 'Big Cheddar',
    category: 'hamburguesas',
    price: 8590,
    description: 'Hamburguesa de 150 gr con lechuga, tomate, baño de abundante queso cheddar fundido, salteado de tocino, champiñones, cebolla morada y papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
  },
  {
    id: 'hamb-doble-queso',
    name: 'Hamburguesa Doble Queso',
    category: 'hamburguesas',
    price: 7990,
    hasCheeseSelection: true,
    description: 'Hamburguesa de 150 gr con doble porción de queso a elegir (chanco o cheddar) fundido y acompañamiento de papas fritas crocantes.',
    image: '/src/assets/images/hamburguesa_artesanal_1792959834825.jpg',
  },
  {
    id: 'hamb-mix-carnes',
    name: 'Hamburguesa Mix Carnes',
    category: 'hamburguesas',
    price: 9290,
    description: 'Hamburguesa de 150 gr con lechuga, tomate, chorizo ahumado, tocino crispy, pepperoni, queso cheddar, salsa bbq y papas fritas.',
    image: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg',
  },
  {
    id: 'hamb-brasilena',
    name: 'Hamburguesa Brasileña',
    category: 'hamburguesas',
    price: 8890,
    description: 'Hamburguesa de 150 gr con lechuga fresca, tomate en rodajas, palta, huevo frito a la plancha, queso chanco, aros de cebolla y papas fritas.',
    image: '/src/assets/images/hamburguesa_artesanal_1792959834825.jpg',
  },

  // ==========================================
  // MECHADA ARTESANAL (10 Variedades)
  // ==========================================
  {
    id: 'mech-chaval',
    name: 'Mechada Chaval',
    category: 'mechada',
    price: 8990,
    description: 'Carne mechada jugosa con queso chanco fundido, champiñones, pimentón salteado, chorizo, mayonesa casera y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
    isPopular: true,
  },
  {
    id: 'mech-gringa',
    name: 'Mechada Gringa',
    category: 'mechada',
    price: 9490,
    description: 'Mechada desmenuzada con lechuga, tomate fresco, tocino, queso cheddar derretido, huevos fritos, aros de cebolla crujientes, salsa BBQ y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-brasilena',
    name: 'Mechada Brasileña',
    category: 'mechada',
    price: 8990,
    description: 'Mechada tierna con lechuga, tomate, palta hass suave, huevo frito, queso chanco, aros de cebolla crocantes, salsa BBQ y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-americana',
    name: 'Mechada Americana',
    category: 'mechada',
    price: 8990,
    description: 'Mechada con pepinillos agridulces, queso cheddar fundido, tocino crujiente, cebolla caramelizada, huevo revuelto, 3 aros de cebolla, salsa BBQ y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-criolla',
    name: 'Mechada Criolla',
    category: 'mechada',
    price: 8990,
    description: 'Carne mechada con cebolla caramelizada, pebre fresco criollo, rodajas de chorizo, mayonesa casera y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
    isPopular: true,
  },
  {
    id: 'mech-doble-queso',
    name: 'Mechada Doble Queso',
    category: 'mechada',
    price: 8290,
    hasCheeseSelection: true,
    description: 'Carne mechada con doble queso a elegir (chanco fundido o cheddar) y papas fritas recién hechas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-campestre',
    name: 'Mechada Campestre',
    category: 'mechada',
    price: 8990,
    description: 'Mechada con queso chanco, salteado de tomate, champiñones, aceituna, cebolla caramelizada, crema de leche, mostaza en grano, mayo casera y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-franchute',
    name: 'Mechada Franchute',
    category: 'mechada',
    price: 9290,
    description: 'Mechada con rúcula fresca, champiñones salteados, cebolla caramelizada, almendras tostadas, crema de queso azul, mayonesa, pesto y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-4-quesos',
    name: 'Mechada 4 Quesos',
    category: 'mechada',
    price: 9290,
    description: 'Mechada con lechuga, tomate, salsa fundida de queso chanco, cheddar, azul y philadelphia, mayo pesto artesanal y papas fritas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
  },
  {
    id: 'mech-italiana',
    name: 'Mechada Italiana',
    category: 'mechada',
    price: 8290,
    description: 'Carne mechada de larga cocción con palta hass suave, tomate en láminas, mayonesa casera y papas fritas doradas.',
    image: '/src/assets/images/mechada_sandwich_1792959834291.jpg',
    isPopular: true,
  },

  // ==========================================
  // PLATOS VEGETARIANOS (2 Variedades)
  // ==========================================
  {
    id: 'veggie-fungi',
    name: 'Plato Vegetariano Fungi',
    category: 'vegetarianos',
    price: 8190,
    description: 'Tortilla de champiñones con cebolla caramelizada, almendras, base de cebolla morada, cubierta de queso de cabra fundido, palta hass, mayonesa de ajo ciboulette y papas fritas.',
    image: '/src/assets/images/veggie_dish_gourmet_1792959834727.jpg',
  },
  {
    id: 'veggie-huerto',
    name: 'Plato Vegetariano Huerto',
    category: 'vegetarianos',
    price: 7990,
    description: 'Tortilla de zanahoria con champiñones, aceitunas sevillanas, cebolla, palta, tomate fresco, lechuga, mayonesa suave, ajo ciboulette y papas fritas.',
    image: '/src/assets/images/veggie_dish_gourmet_1792959834727.jpg',
  },

  // ==========================================
  // BEBESTIBLES & GASEOSAS (4 Variedades - Lata 350ml)
  // ==========================================
  {
    id: 'beb-coca-zero',
    name: 'Coca-Cola Sin Azúcar',
    category: 'bebestibles',
    price: 1990,
    description: 'Lata de 350 ml bien fría, sabor refrescante sin azúcar.',
    image: '/src/assets/images/drink_coca_can_1792959926113.jpg',
  },
  {
    id: 'beb-coca-original',
    name: 'Coca-Cola Original',
    category: 'bebestibles',
    price: 1990,
    description: 'Lata de 350 ml clásica, servida bien fría.',
    image: '/src/assets/images/drink_coca_can_1792959926113.jpg',
  },
  {
    id: 'beb-sprite',
    name: 'Sprite 350 Ml',
    category: 'bebestibles',
    price: 1990,
    description: 'Lata de 350 ml lima-limón, fresca y burbujeante.',
    image: '/src/assets/images/drink_citrus_soda_1792959940926.jpg',
  },
  {
    id: 'beb-fanta',
    name: 'Fanta Naranja 350 Ml',
    category: 'bebestibles',
    price: 1990,
    description: 'Lata de 350 ml sabor naranja intenso, servida helada.',
    image: '/src/assets/images/drink_citrus_soda_1792959940926.jpg',
  },
];

import { Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'hamburguesas', label: 'Hamburguesas', icon: '🍔' },
  { id: 'mechada', label: 'Mechada', icon: '🥪' },
  { id: 'vegetarianos', label: 'Platos Vegetarianos', icon: '🥗' },
  { id: 'bebestibles', label: 'Bebestibles & Gaseosas', icon: '🥤' },
];

export const CATEGORIES = INITIAL_CATEGORIES;

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount).replace('CLP', '$').trim();
}
