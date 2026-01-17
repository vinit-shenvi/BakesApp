import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, DeliveryPartner, User, OrderStatus, DeliveryMethod, CartItem } from './types';
import { INITIAL_PRODUCTS as PRODUCTS, INITIAL_PARTNERS as DELIVERY_PARTNERS, INITIAL_ORDERS as MOCK_ORDERS } from './constants';

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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); // Start with mock data for Vercel demo
  const [deliveryPartners] = useState<DeliveryPartner[]>(DELIVERY_PARTNERS);
  const [user] = useState<User>({ id: 'u1', name: 'Admin User', email: 'admin@kantibakes.com', role: 'admin' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fetch orders on mount and poll every 2 seconds
  useEffect(() => {
    // In valid production, we would fetch from a real backend.
    // For this Vercel demo without a separate backend, we'll skip the fetch or likely use mock data.
    // The ORDERS are initialized to [] but we might want MOCK_ORDERS if we want to see something.
    if (orders.length === 0) {
      // setOrders(MOCK_ORDERS); // Optional: if we want to start with data
    }

    const fetchOrders = async () => {
      try {
        // const response = await fetch('http://localhost:5000/api/orders');
        // if (response.ok) {
        //   const data = await response.json();
        //   setOrders(data);
        // }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    // fetchOrders();
    // const interval = setInterval(fetchOrders, 2000); 
    // return () => clearInterval(interval);
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
    // This is client-side implementation for reference, but actual placement happens in Flutter app
    // For web admin testing, we could add this back if needed.
    setCart([]);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    // Sync with backend
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedPartnerId: partnerId, status: OrderStatus.ACCEPTED } : o));
  };

  return (
    <StoreContext.Provider value={{
      products, orders, deliveryPartners, user, cart, wishlist,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist,
      placeOrder, updateOrderStatus, assignDeliveryPartner
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
