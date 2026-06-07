export interface Venue {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  venueId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  notes?: string;
  // Denormalized/held for convenience
  menuItemName: string;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  venueId: string;
  tableId: string;
  status: OrderStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Table {
  id: string;
  venueId: string;
  tableNumber: string;
  qrCodeUrl?: string;
}
