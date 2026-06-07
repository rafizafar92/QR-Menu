import { MenuItem, Table, Order, Venue } from './types';

export const MOCK_VENUE: Venue = {
  id: 'venue_sweet_bite',
  name: 'Sweet Bite Café',
  description: 'Gourmet desserts, freshly brewed artisanal coffee, and signature brunch selections served all day.',
  logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop',
};

export const MOCK_CATEGORIES = [
  'All',
  'Signature Coffee',
  'Gourmet Pastries',
  'All-Day Brunch',
  'Beverages'
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item_1',
    venueId: 'venue_sweet_bite',
    name: 'Vanilla Bean Latte',
    description: 'Double shot of house espresso, creamy microfoam, premium organic Madagascar vanilla bean syrup.',
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&h=400&fit=crop',
    category: 'Signature Coffee',
    isAvailable: true,
  },
  {
    id: 'item_2',
    venueId: 'venue_sweet_bite',
    name: 'Pistachio Croissant',
    description: 'Flaky twice-baked sourdough croissant loaded with rich house-made Tunisian pistachio cream.',
    price: 6.25,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=400&fit=crop',
    category: 'Gourmet Pastries',
    isAvailable: true,
  },
  {
    id: 'item_3',
    venueId: 'venue_sweet_bite',
    name: 'Avocado Sourdough Toast',
    description: 'Crushed Hass avocado, poached heirloom eggs, goat cheese crumbles, micro-greens, chili threads on artisanal house sourdough.',
    price: 14.50,
    imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&h=400&fit=crop',
    category: 'All-Day Brunch',
    isAvailable: true,
  },
  {
    id: 'item_4',
    venueId: 'venue_sweet_bite',
    name: 'Smoked Salmon Benedict',
    description: 'Cold-smoked wild-caught sockeye salmon, fresh organic spinach, lemon chive hollandaise on toasted english muffin.',
    price: 16.75,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=400&fit=crop',
    category: 'All-Day Brunch',
    isAvailable: true,
  },
  {
    id: 'item_5',
    venueId: 'venue_sweet_bite',
    name: 'Hibiscus Iced Berry Tea',
    description: 'Organic steep of Egyptian wild hibiscus flower, sweet muddled blackberries, fresh touch of mint leaf syrup.',
    price: 4.75,
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&h=400&fit=crop',
    category: 'Beverages',
    isAvailable: true,
  },
  {
    id: 'item_6',
    venueId: 'venue_sweet_bite',
    name: 'Matcha White Chocolate Cookie',
    description: 'Soft-baked ceremonial Uji matcha cookie dough packed with premium Belgian white chocolate chunks.',
    price: 3.95,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=400&fit=crop',
    category: 'Gourmet Pastries',
    isAvailable: false, // Out of stock example
  }
];

export const MOCK_TABLES: Table[] = [
  { id: 't1', venueId: 'venue_sweet_bite', tableNumber: 'Table 1' },
  { id: 't2', venueId: 'venue_sweet_bite', tableNumber: 'Table 2' },
  { id: 't3', venueId: 'venue_sweet_bite', tableNumber: 'Table 3' },
  { id: 't4', venueId: 'venue_sweet_bite', tableNumber: 'Table 4' },
  { id: 't5', venueId: 'venue_sweet_bite', tableNumber: 'Table 5' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_101',
    venueId: 'venue_sweet_bite',
    tableId: 't1',
    status: 'pending',
    totalPrice: 20.75,
    notes: 'Extra cream on the latency latte, please!',
    createdAt: '2026-06-06T19:30:00Z',
    items: [
      {
        id: 'oi_1',
        orderId: 'ord_101',
        menuItemId: 'item_1',
        quantity: 1,
        menuItemName: 'Vanilla Bean Latte',
        price: 5.50
      },
      {
        id: 'oi_2',
        orderId: 'ord_101',
        menuItemId: 'item_3',
        quantity: 1,
        notes: 'Toast extra crispy',
        menuItemName: 'Avocado Sourdough Toast',
        price: 14.50
      }
    ]
  },
  {
    id: 'ord_102',
    venueId: 'venue_sweet_bite',
    tableId: 't3',
    status: 'preparing',
    totalPrice: 35.50,
    notes: 'Please bring orders out together',
    createdAt: '2026-06-06T19:22:15Z',
    items: [
      {
        id: 'oi_3',
        orderId: 'ord_102',
        menuItemId: 'item_4',
        quantity: 2,
        menuItemName: 'Smoked Salmon Benedict',
        price: 16.75
      },
      {
        id: 'oi_4',
        orderId: 'ord_102',
        menuItemId: 'item_5',
        quantity: 1,
        notes: 'No ice',
        menuItemName: 'Hibiscus Iced Berry Tea',
        price: 4.75
      }
    ]
  },
  {
    id: 'ord_103',
    venueId: 'venue_sweet_bite',
    tableId: 't2',
    status: 'completed',
    totalPrice: 11.75,
    createdAt: '2026-06-06T18:45:00Z',
    items: [
      {
        id: 'oi_5',
        orderId: 'ord_103',
        menuItemId: 'item_1',
        quantity: 1,
        menuItemName: 'Vanilla Bean Latte',
        price: 5.50
      },
      {
        id: 'oi_6',
        orderId: 'ord_103',
        menuItemId: 'item_2',
        quantity: 1,
        menuItemName: 'Pistachio Croissant',
        price: 6.25
      }
    ]
  }
];
