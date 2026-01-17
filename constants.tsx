
import { Product, DeliveryPartner, Order, OrderStatus, DeliveryMethod } from './types';

export const CATEGORIES = [
  'Best Sellers',
  'Kaju Specials',
  'Fresh Sweets',
  'Savory Kara',
  'Dry Fruits',
  'Cricket World Cup',
  'Sankranti Specials'
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Almond Fudge Brownie', category: 'Best Sellers', price: 12.99, image: 'https://picsum.photos/seed/bakery1/400/300', isBestSeller: true, inStock: true, description: 'Rich chocolate brownie with crunchy almonds.' },
  { id: '2', name: 'Kaju Katli Premium', category: 'Kaju Specials', price: 18.50, image: 'https://picsum.photos/seed/bakery2/400/300', inStock: true, description: 'Classic cashew sweet with silver vark.' },
  { id: '3', name: 'Masala Sev', category: 'Savory Kara', price: 5.99, image: 'https://picsum.photos/seed/bakery3/400/300', inStock: true, description: 'Spicy chickpea flour noodles.' },
  { id: '4', name: 'Ghee Laddu', category: 'Fresh Sweets', price: 14.25, image: 'https://picsum.photos/seed/bakery4/400/300', inStock: true, description: 'Traditional aromatic ghee balls.' },
  { id: '5', name: 'Stadium Cake Pop', category: 'Cricket World Cup', price: 4.50, image: 'https://picsum.photos/seed/cricket1/400/300', isFestive: true, festiveType: 'Cricket', inStock: true, description: 'Cricket ball themed cake pops.' },
  { id: '6', name: 'Til Gul Laddu', category: 'Sankranti Specials', price: 8.99, image: 'https://picsum.photos/seed/sankranti1/400/300', isFestive: true, festiveType: 'Sankranti', inStock: true, description: 'Sesame and jaggery traditional sweet.' },
  { id: '7', name: 'Kaju Pista Roll', category: 'Kaju Specials', price: 21.00, image: 'https://picsum.photos/seed/bakery7/400/300', inStock: true, description: 'Cashew roll stuffed with pistachios.' },
  { id: '8', name: 'Spicy Mixture', category: 'Savory Kara', price: 6.50, image: 'https://picsum.photos/seed/bakery8/400/300', inStock: true, description: 'Crunchy savory mix with peanuts and curry leaves.' }
];

export const INITIAL_PARTNERS: DeliveryPartner[] = [
  { id: 'p1', name: 'Rahul Kumar', status: 'ONLINE', phone: '+91 9876543210', currentOrders: [], performanceScore: 4.8 },
  { id: 'p2', name: 'Amit Singh', status: 'OFFLINE', phone: '+91 9123456789', currentOrders: [], performanceScore: 4.5 }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+91 9988776655',
    address: '123 Bakery Lane, Sweet City',
    items: [{ ...INITIAL_PRODUCTS[0], quantity: 2 }],
    total: 25.98,
    status: OrderStatus.NEW,
    method: DeliveryMethod.HOME_DELIVERY,
    timestamp: new Date().toISOString(),
    paymentStatus: 'PAID',
    shippingCharge: 80,
    tax: 26.9,
    transactionId: 'ORDR_26_P2811_5WRR',
    activityLog: [
      { status: 'Order created', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Order placed by customer' },
      { status: 'Payment received for order', timestamp: new Date(Date.now() - 3500000).toISOString(), message: 'Transaction ID: ORDR_26_P2811_5WRR' },
      { status: 'Order accepted at store', timestamp: new Date(Date.now() - 3000000).toISOString(), message: 'Store acknowledged order' }
    ]
  }
];
