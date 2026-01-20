import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, DeliveryPartner, User, OrderStatus, DeliveryMethod, CartItem, DeliverySettings } from './types';
import { INITIAL_PRODUCTS as PRODUCTS, INITIAL_PARTNERS as DELIVERY_PARTNERS, INITIAL_ORDERS as MOCK_ORDERS, INITIAL_DELIVERY_SETTINGS } from './constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  deliveryPartners: DeliveryPartner[];
  user: User;
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (method: DeliveryMethod, location: any) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDeliveryPartner: (orderId: string, partnerId: string) => void;
  addPartner: (partnerData: { name: string; phone: string; bloodGroup: string }) => void;
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (settings: DeliverySettings) => void;
  calculateDeliveryFee: (location: google.maps.LatLngLiteral) => { fee: number; distance: number };

  // Auth Auth
  isAuthenticated: boolean;
  userRole: 'super_admin' | 'outlet_admin' | 'customer' | 'delivery' | 'admin' | null;
  login: (email: string, role: 'super_admin' | 'outlet_admin' | 'customer' | 'delivery' | 'admin') => void;
  register: (name: string, email: string, role: 'customer') => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(DELIVERY_PARTNERS);
  const [user, setUser] = useState<User>({ id: 'u1', name: 'Admin User', email: 'admin@kantibakes.com', role: 'admin', points: 240, orders: [], wishlist: [] });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'super_admin' | 'outlet_admin' | 'customer' | 'delivery' | 'admin' | null>(null);

  const login = (email: string, role: 'super_admin' | 'outlet_admin' | 'customer' | 'delivery' | 'admin') => {
    setIsAuthenticated(true);
    setUserRole(role);

    // Mock user update based on role
    if (role === 'super_admin') setUser({ ...user, role: 'super_admin', name: 'Super Admin (HO)', storeId: 'HEAD_OFFICE' });
    if (role === 'outlet_admin') setUser({ ...user, role: 'outlet_admin', name: 'Outlet Manager (HSR)', storeId: 's1' }); // Defaulting to HSR store
    if (role === 'admin') setUser({ ...user, role: 'admin', name: 'Admin User' }); // Fallback
    if (role === 'customer') setUser({ ...user, role: 'customer', name: 'Harshita Sharma' });
    if (role === 'delivery') setUser({ ...user, role: 'delivery', name: 'Rahul Kumar' });
  };

  const register = (name: string, email: string, role: 'customer') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUser({
      id: `u${Date.now()}`,
      name: name,
      email: email,
      role: role,
      points: 0,
      orders: [],
      wishlist: []
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // ... rest of the existing useEffects and functions ...

  // Fetch orders on mount and poll every 2 seconds
  useEffect(() => {
    if (orders.length === 0) {
      // setOrders(MOCK_ORDERS); 
    }
    const fetchOrders = async () => {
      // ... fetch logic
    };
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const placeOrder = async (method: DeliveryMethod, location: any) => {
    setCart([]);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, partnerId?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, assignedPartnerId: partnerId || o.assignedPartnerId } : o));
  };

  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedPartnerId: partnerId, status: OrderStatus.ACCEPTED } : o));
  };

  const addPartner = (partnerData: { name: string; phone: string; bloodGroup: string }) => {
    const newPartner: DeliveryPartner = {
      id: `p${Date.now()}`,
      name: partnerData.name,
      phone: partnerData.phone,
      bloodGroup: partnerData.bloodGroup,
      status: 'OFFLINE',
      currentOrders: [],
      performanceScore: 5.0
    };
    setDeliveryPartners(prev => [...prev, newPartner]);
  };

  const togglePartnerStatus = (partnerId: string) => {
    setDeliveryPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status: p.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : p));
  };

  const updateDeliverySettings = (settings: DeliverySettings) => {
    setDeliverySettings(settings);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const calculateDeliveryFee = (location: google.maps.LatLngLiteral) => {
    const STORE_LOC = { lat: 12.7786, lng: 77.7629 };
    const R = 6371;
    const dLat = (location.lat - STORE_LOC.lat) * (Math.PI / 180);
    const dLon = (location.lng - STORE_LOC.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(STORE_LOC.lat * (Math.PI / 180)) * Math.cos(location.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const tier = deliverySettings.tiers.find(t => distance >= t.minDistance && distance < t.maxDistance);
    let fee = 0;
    if (tier) {
      fee = tier.price;
    } else if (distance >= 10) {
      fee = 120 + Math.round((distance - 10) * 10);
    } else {
      fee = deliverySettings.basePrice;
    }
    return { fee: Math.round(fee), distance: parseFloat(distance.toFixed(1)) };
  };

  return (
    <StoreContext.Provider value={{
      products, orders, deliveryPartners, user, cart, wishlist,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist,
      placeOrder, updateOrderStatus, assignDeliveryPartner, addPartner,
      deliverySettings, updateDeliverySettings, calculateDeliveryFee,
      isAuthenticated, userRole, login, logout, togglePartnerStatus, addProduct, register
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
