
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

export interface ProductVariant {
  id: string;
  weight: string; // e.g. "1 kg", "500 gms"
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  code?: string; // New
  name: string;
  category: string;
  price: number; // Base price or range start
  image: string;
  shelfLife?: string; // New e.g. "60 days"
  courierAvailable?: boolean; // New
  variants?: ProductVariant[]; // New
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
  receiverName?: string; // New: Receiver Details for delivery
  receiverPhone?: string; // New: Receiver Details for delivery
  items: CartItem[];
  total: number;
  status: OrderStatus;
  method: DeliveryMethod;
  timestamp: string;
  partnerId?: string;
  storeId?: string; // New: For Multi-Store
  paymentStatus: 'PAID' | 'PENDING';
  shippingCharge?: number;
  tax?: number;
  transactionId?: string;
  activityLog?: { status: string; timestamp: string; message: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'outlet_admin' | 'customer' | 'delivery' | 'admin'; // keeping 'admin' for backward compat until refactored
  storeId?: string; // For outlet admins
  storeName?: string; // For display purposes
  points: number;
  orders: string[];
  wishlist: string[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  email?: string; // New: Login Credential
  password?: string; // New: Login Credential
  status: 'ONLINE' | 'OFFLINE';
  phone: string;
  bloodGroup?: string;
  currentOrders: string[];
  performanceScore: number;
}

export interface DeliveryTier {
  minDistance: number;
  maxDistance: number;
  price: number;
}

export interface DeliverySettings {
  id: string;
  basePrice: number;
  minOrderValue: number;
  maxOrderValue: number;
  tiers: DeliveryTier[];
  active: boolean;
}

export enum AppRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY'
}
