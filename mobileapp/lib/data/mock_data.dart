
import '../models/types.dart';

final List<Product> PRODUCTS = [
  // Makar Sankranti Specials
  Product(
    id: 'ms1',
    name: 'Heritage Til-Gul Ladoo',
    price: 349,
    weight: '250G',
    image: 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?q=80&w=500&auto=format&fit=crop',
    category: 'Sankranti Specials',
    isVeg: true,
    discount: 'SPECIAL',
    isLimited: true,
  ),
  Product(
    id: 'ms2',
    name: 'Sesame & Jaggery Cookies',
    price: 280,
    weight: '200G',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500&auto=format&fit=crop',
    category: 'Sankranti Specials',
    isVeg: true,
  ),
  Product(
    id: 'ms3',
    name: 'Saffron Peanut Chikki',
    price: 199,
    weight: '150G',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=500&auto=format&fit=crop',
    category: 'Sankranti Specials',
    isVeg: true,
    discount: 'FESTIVE',
  ),
  // Valentine Specials
  Product(
    id: 'v1',
    name: 'Red Velvet Heart Cake',
    price: 699,
    weight: '500G',
    image: 'https://images.unsplash.com/photo-1586985289906-4069f0cff15d?q=80&w=500&auto=format&fit=crop',
    category: 'Valentine Specials',
    isVeg: true,
    discount: '18% OFF',
  ),
  Product(
    id: 'v2',
    name: 'Love Macarons',
    price: 499,
    weight: 'SET OF 6',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1619702661?q=80&w=500&auto=format&fit=crop',
    category: 'Valentine Specials',
    isVeg: true,
    discount: '16% OFF',
  ),
  // Biscuits & Sticks
  Product(
    id: 'b1',
    name: 'Saffron Jeera Sticks',
    price: 120,
    weight: '200G',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=500&auto=format&fit=crop',
    category: 'Biscuits & Sticks',
    isVeg: true,
    discount: '20% OFF',
  ),
  Product(
    id: 'b2',
    name: 'Almond Biscotti',
    price: 180,
    weight: '150G',
    image: 'https://images.unsplash.com/photo-1619038480411-38ae54633c54?q=80&w=500&auto=format&fit=crop',
    category: 'Biscuits & Sticks',
    isVeg: true,
  ),
  // Buns & Breads
  Product(
    id: 'br1',
    name: 'Soft Garlic Buns',
    price: 85,
    weight: 'PACK OF 2',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500&auto=format&fit=crop',
    category: 'Buns & Breads',
    isVeg: true,
    discount: '22% OFF',
  ),
  Product(
    id: 'br2',
    name: 'Artisan Sourdough',
    price: 240,
    weight: '450G',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=500&auto=format&fit=crop',
    category: 'Buns & Breads',
    isVeg: true,
  ),
  // Chocolates
  Product(
    id: 'c1',
    name: 'Dark Cocoa Hearts',
    price: 450,
    weight: '100G BOX',
    image: 'https://images.unsplash.com/photo-1548907040-4ba421ea2443?q=80&w=500&auto=format&fit=crop',
    category: 'Chocolates',
    isVeg: true,
    isLimited: true,
  ),
  Product(
    id: 'c2',
    name: 'Hazelnut Truffles',
    price: 320,
    weight: 'PACK OF 4',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=500&auto=format&fit=crop',
    category: 'Chocolates',
    isVeg: true,
  ),
];

final List<Order> MOCK_ORDERS = [
  Order(
    id: 'ORD-8291',
    date: '12 Feb, 2025',
    status: 'Delivered',
    total: 845.50,
    method: DeliveryMethod.delivery,
    items: [
      OrderItem(id: 'v1', name: 'Red Velvet Heart Cake', quantity: 1, price: 699),
      OrderItem(id: 'b1', name: 'Saffron Jeera Sticks', quantity: 1, price: 120),
    ],
  ),
  Order(
    id: 'ORD-7721',
    date: '08 Feb, 2025',
    status: 'Delivered',
    total: 320.00,
    method: DeliveryMethod.pickup,
    items: [
      OrderItem(id: 'c2', name: 'Hazelnut Truffles', quantity: 1, price: 320),
    ],
  ),
];

const List<String> CATEGORIES = [
  'Sankranti Specials',
  'Valentine Specials',
  'Biscuits & Sticks',
  'Buns & Breads',
  'Chocolates',
  'Cakes & Pastries',
  'Desserts',
  'Snacks',
  'Tea Cakes & Muffins',
  'Candles',
  'Attars',
];
