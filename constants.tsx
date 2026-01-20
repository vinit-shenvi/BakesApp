
import { Product, DeliveryPartner, Order, OrderStatus, DeliveryMethod, DeliverySettings } from './types';

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
  {
    id: '1',
    code: 'BRW_01',
    name: 'Almond Fudge Brownie',
    category: 'Best Sellers',
    price: 12.99,
    image: 'https://picsum.photos/seed/bakery1/400/300',
    isBestSeller: true,
    inStock: true,
    description: 'Rich chocolate brownie with crunchy almonds.',
    shelfLife: '7 Days',
    courierAvailable: true,
    variants: [
      { id: 'v1_1', weight: '1 pc', price: 12.99, inStock: true },
      { id: 'v1_2', weight: 'Box of 6', price: 70.00, inStock: true }
    ]
  },
  {
    id: '2',
    code: 'KAJ_02',
    name: 'Kaju Katli Premium',
    category: 'Kaju Specials',
    price: 18.50,
    image: 'https://picsum.photos/seed/bakery2/400/300',
    inStock: true,
    description: 'Classic cashew sweet with silver vark.',
    shelfLife: '20 Days',
    courierAvailable: true,
    variants: [
      { id: 'v2_1', weight: '250 gms', price: 18.50, inStock: true },
      { id: 'v2_2', weight: '500 gms', price: 36.00, inStock: true },
      { id: 'v2_3', weight: '1 kg', price: 70.00, inStock: false }
    ]
  },
  {
    id: '3',
    code: 'SEV_03',
    name: 'Masala Sev',
    category: 'Savory Kara',
    price: 5.99,
    image: 'https://picsum.photos/seed/bakery3/400/300',
    inStock: true,
    description: 'Spicy chickpea flour noodles.',
    shelfLife: '30 Days',
    courierAvailable: true,
    variants: [
      { id: 'v3_1', weight: '200 gms', price: 5.99, inStock: true },
      { id: 'v3_2', weight: '500 gms', price: 14.00, inStock: true }
    ]
  },
  {
    id: '4',
    code: 'LAD_04',
    name: 'Ghee Laddu',
    category: 'Fresh Sweets',
    price: 14.25,
    image: 'https://picsum.photos/seed/bakery4/400/300',
    inStock: true,
    description: 'Traditional aromatic ghee balls.',
    shelfLife: '10 Days',
    courierAvailable: false,
    variants: [
      { id: 'v4_1', weight: '250 gms', price: 14.25, inStock: true },
      { id: 'v4_2', weight: '500 gms', price: 28.00, inStock: true }
    ]
  },
  {
    id: '5',
    code: 'CKT_05',
    name: 'Stadium Cake Pop',
    category: 'Cricket World Cup',
    price: 4.50,
    image: 'https://picsum.photos/seed/cricket1/400/300',
    isFestive: true,
    festiveType: 'Cricket',
    inStock: true,
    description: 'Cricket ball themed cake pops.',
    shelfLife: '3 Days',
    courierAvailable: false,
    variants: [
      { id: 'v5_1', weight: '1 pc', price: 4.50, inStock: true },
      { id: 'v5_2', weight: 'Team Pack (11 pcs)', price: 45.00, inStock: true }
    ]
  },
  {
    id: '6',
    code: 'TIL_06',
    name: 'Til Gul Laddu',
    category: 'Sankranti Specials',
    price: 8.99,
    image: 'https://picsum.photos/seed/sankranti1/400/300',
    isFestive: true,
    festiveType: 'Sankranti',
    inStock: true,
    description: 'Sesame and jaggery traditional sweet.',
    shelfLife: '45 Days',
    courierAvailable: true,
    variants: [
      { id: 'v6_1', weight: '250 gms', price: 8.99, inStock: true },
      { id: 'v6_2', weight: '1 kg', price: 32.00, inStock: true }
    ]
  },
  {
    id: '7',
    code: 'KAJ_07',
    name: 'Kaju Pista Roll',
    category: 'Kaju Specials',
    price: 21.00,
    image: 'https://picsum.photos/seed/bakery7/400/300',
    inStock: true,
    description: 'Cashew roll stuffed with pistachios.',
    shelfLife: '20 Days',
    courierAvailable: true,
    variants: [
      { id: 'v7_1', weight: '250 gms', price: 21.00, inStock: true },
      { id: 'v7_2', weight: '500 gms', price: 41.00, inStock: false }
    ]
  },
  {
    id: '8',
    code: 'MIX_08',
    name: 'Spicy Mixture',
    category: 'Savory Kara',
    price: 6.50,
    image: 'https://picsum.photos/seed/bakery8/400/300',
    inStock: true,
    description: 'Crunchy savory mix with peanuts and curry leaves.',
    shelfLife: '60 Days',
    courierAvailable: true,
    variants: [
      { id: 'v8_1', weight: '200 gms', price: 6.50, inStock: true },
      { id: 'v8_2', weight: '500 gms', price: 15.00, inStock: true },
      { id: 'v8_3', weight: '1 kg', price: 28.00, inStock: true }
    ]
  }
];

export const INITIAL_PARTNERS: DeliveryPartner[] = [
  { id: 'p1', name: 'Rahul Kumar', status: 'ONLINE', phone: '+91 9876543210', email: 'rahul@kantibakes.com', password: 'password123', currentOrders: [], performanceScore: 4.8 },
  { id: 'p2', name: 'Amit Singh', status: 'OFFLINE', phone: '+91 9123456789', email: 'amit@kantibakes.com', password: 'password123', currentOrders: [], performanceScore: 4.5 }
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
    storeId: 'Indiranagar', // Matches new Dropdown
    activityLog: [
      { status: 'Order created', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Order placed by customer' },
      { status: 'Payment received for order', timestamp: new Date(Date.now() - 3500000).toISOString(), message: 'Transaction ID: ORDR_26_P2811_5WRR' },
      { status: 'Order accepted at store', timestamp: new Date(Date.now() - 3000000).toISOString(), message: 'Store acknowledged order' }
    ]
  }
];

export const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  id: 'ds1',
  basePrice: 6,
  minOrderValue: 0,
  maxOrderValue: 5000,
  active: true,
  tiers: [
    { minDistance: 0, maxDistance: 3, price: 50 },
    { minDistance: 3, maxDistance: 7, price: 80 },
    { minDistance: 7, maxDistance: 10, price: 120 }
  ]
};
