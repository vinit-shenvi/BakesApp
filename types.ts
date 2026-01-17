
export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryMethod {
  PICKUP = 'PICKUP',
  HOME_DELIVERY = 'HOME_DELIVERY'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isBestSeller?: boolean;
  isFestive?: boolean;
  festiveType?: string;
  inStock: boolean;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  method: DeliveryMethod;
  timestamp: string;
  partnerId?: string;
  paymentStatus: 'PAID' | 'PENDING';
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  orders: string[];
  wishlist: string[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  phone: string;
  currentOrders: string[];
  performanceScore: number;
}

export enum AppRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY'
}
