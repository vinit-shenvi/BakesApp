
import React, { useState, useEffect, useMemo } from 'react';
import {
   Search, Heart, ShoppingCart, User, Home, Star, ChevronRight, Plus, Minus,
   MapPin, Package, Clock, Truck, CheckCircle2, X, ChevronDown, Utensils, Info, Phone, ArrowLeft, ArrowRight, Wallet, LogOut,
   Settings, LocateFixed
} from 'lucide-react';
import { GoogleMap } from '@react-google-maps/api';
import { MapsWrapper } from '../components/MapsWrapper';
import { useStore } from '../storeContext';
import { CATEGORIES } from '../constants';
import { Badge, Card, Button } from '../components/Shared';
import { DeliveryMethod, OrderStatus, Product, Order } from '../types';

const STORES = [
   { id: 's1', name: 'HSR Layout Kitchen', address: 'Sector 7, HSR, Bangalore', dist: 1.2 },
   { id: 's2', name: 'Indiranagar Boutique', address: '100ft Road, Indiranagar', dist: 4.5 },
   { id: 's3', name: 'Koramangala Studio', address: '80ft Road, 4th Block', dist: 3.2 }
];

export const CustomerApp: React.FC = () => {
   const {
      user, products, cart, wishlist, addToCart: addToCartAction,
      removeFromCart, updateCartQuantity, toggleWishlist, placeOrder,
      calculateDeliveryFee
   } = useStore();

   const [activeTab, setActiveTab] = useState<'home' | 'festive' | 'account'>('home');
   const [currentScreen, setCurrentScreen] = useState<'main' | 'search' | 'history' | 'wishlist' | 'checkout' | 'category'>('main');
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

   const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.HOME_DELIVERY);
   const [showLocationPicker, setShowLocationPicker] = useState(false);
   const [selectedStore, setSelectedStore] = useState(STORES[0]);
   const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default center (Bangalore)

   const [searchQuery, setSearchQuery] = useState('');
   const [searchResult, setSearchResult] = useState<Product[]>([]);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

   // Derived Values
   const itemsTotal = cart.reduce((sum, item) => sum + (item.price * 50 * item.quantity), 0);
   const cgst = itemsTotal * 0.025;
   const sgst = itemsTotal * 0.025;
   const { fee: deliveryFee, distance: deliveryDistance } = React.useMemo(() => {
      if (deliveryMethod === DeliveryMethod.PICKUP) return { fee: 0, distance: 0 };
      // Use the center of the map (user's pinned location) for calculation
      return calculateDeliveryFee(mapCenter);
   }, [mapCenter, deliveryMethod, calculateDeliveryFee]);

   const grandTotal = itemsTotal + cgst + sgst + deliveryFee;

   const handleSearch = (query: string) => {
      setSearchQuery(query);
      if (!query) {
         setSearchResult([]);
         return;
      }
      const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()));
      setSearchResult(filtered);
   };

   const ProductCardSmall: React.FC<{ product: Product }> = ({ product }) => {
      const cartItem = cart.find(item => item.id === product.id);
      const isWished = wishlist.includes(product.id);
      return (
         <div onClick={() => setSelectedProduct(product)} className="bg-white rounded-[28px] p-3 shadow-sm border border-stone-100/50 flex flex-col relative w-44 flex-shrink-0 snap-center cursor-pointer active:scale-95 transition-transform">
            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 rounded-full shadow-sm">
               <Heart className={`w-3 h-3 ${isWished ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`} />
            </button>
            <div className="h-32 rounded-2xl overflow-hidden mb-2 bg-stone-50">
               <img src={product.image} className="w-full h-full object-cover" />
            </div>
            <div className="px-1">
               <div className="flex items-center gap-1 mb-1">
                  <div className="w-2 h-2 border border-emerald-600 flex items-center justify-center p-[1px]"><div className="w-1 h-1 bg-emerald-600 rounded-full" /></div>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">250g</span>
               </div>
               <h4 className="font-bold text-stone-800 text-xs line-clamp-1 mb-2">{product.name}</h4>
               <div className="flex items-center justify-between">
                  <span className="font-extrabold text-stone-900 text-sm">₹{Math.round(product.price * 50)}</span>
                  {!cartItem ? (
                     <button onClick={(e) => { e.stopPropagation(); addToCartAction(product); }} className="bg-white border border-orange-500 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Add</button>
                  ) : (
                     <div onClick={(e) => e.stopPropagation()} className="flex items-center bg-orange-500 text-white rounded-full px-2 py-1 gap-2">
                        <button onClick={() => updateCartQuantity(product.id, -1)}><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold">{cartItem.quantity}</span>
                        <button onClick={() => updateCartQuantity(product.id, 1)}><Plus className="w-3 h-3" /></button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   };

   const renderProductModal = () => {
      if (!selectedProduct) return null;
      return (
         <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-[40px] rounded-t-[40px] p-0 overflow-hidden relative animate-in slide-in-from-bottom-full duration-500 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
               {/* Image Header */}
               <div className="h-72 relative flex-shrink-0">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/50 backdrop-blur-md p-2 rounded-full text-stone-800 hover:bg-white transition-colors"><X className="w-5 h-5" /></button>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
               </div>

               {/* Content */}
               <div className="flex-1 -mt-6 bg-white rounded-t-[40px] relative flex flex-col z-10 overflow-hidden">
                  <div className="p-8 overflow-y-auto no-scrollbar pb-24">
                     <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-8" />

                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded">Veg</div>
                              <div className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded">{selectedProduct.category}</div>
                           </div>
                           <h2 className="text-3xl font-black text-stone-800 uppercase leading-none mb-2">{selectedProduct.name}</h2>
                           <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-stone-500">4.8 (120 reviews)</span>
                           </div>
                        </div>
                     </div>

                     <p className="text-stone-500 text-sm leading-relaxed mb-8">{selectedProduct.description || 'Experience the authentic taste of tradition with our handcrafted delicacy. Made with premium ingredients and time-honored recipes passed down through generations.'}</p>

                     <div className="bg-stone-50 p-5 rounded-2xl mb-8">
                        <h4 className="text-xs font-black text-stone-800 uppercase tracking-widest mb-3">Nutritional Info (Per 100g)</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                           <div className="bg-white p-2 rounded-xl border border-stone-100">
                              <p className="text-[10px] font-bold text-stone-400 uppercase">Cal</p>
                              <p className="font-black text-stone-800">450</p>
                           </div>
                           <div className="bg-white p-2 rounded-xl border border-stone-100">
                              <p className="text-[10px] font-bold text-stone-400 uppercase">Prot</p>
                              <p className="font-black text-stone-800">12g</p>
                           </div>
                           <div className="bg-white p-2 rounded-xl border border-stone-100">
                              <p className="text-[10px] font-bold text-stone-400 uppercase">Fat</p>
                              <p className="font-black text-stone-800">18g</p>
                           </div>
                           <div className="bg-white p-2 rounded-xl border border-stone-100">
                              <p className="text-[10px] font-bold text-stone-400 uppercase">Carb</p>
                              <p className="font-black text-stone-800">45g</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-50 flex items-center justify-between gap-6">
                     <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">PRICE (250G)</p>
                        <span className="text-3xl font-black text-stone-800">₹{Math.round(selectedProduct.price * 50)}</span>
                     </div>
                     <button
                        onClick={() => { addToCartAction(selectedProduct); setSelectedProduct(null); }}
                        className="flex-1 bg-orange-600 text-white py-4 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-orange-700"
                     >
                        Add to Cart <Plus className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const renderHome = () => (
      <div className="animate-in fade-in duration-500 pb-32">
         <div className="bg-orange-600 py-1.5">
            <div className="animate-marquee whitespace-nowrap text-white text-[9px] font-black uppercase tracking-[0.3em]">
               TRADITIONAL HEARTCRAFTED BAKES • HAPPY MAKARA SANKRANTI • KAI PO CHE! • HERITAGE TIL-GUL SPECIALS NOW LIVE • SPREADING LOVE •
            </div>
         </div>

         <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl border-b border-stone-50 z-50">
            <button onClick={() => setShowLocationPicker(true)} className="flex flex-col items-start group">
               <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">KANTI EXPRESS - 20MINS</span>
                  <ChevronDown className="w-3 h-3 text-orange-600" />
               </div>
               <p className="font-bold text-stone-900 text-[13px]">
                  {deliveryMethod === DeliveryMethod.HOME_DELIVERY ? 'Home - HSR Layout' : selectedStore.name}
               </p>
            </button>
            <div className="flex items-center gap-3">
               <button onClick={() => setCurrentScreen('search')} className="p-2.5 bg-stone-50 rounded-full text-orange-600"><Search className="w-5 h-5" /></button>
               <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden" onClick={() => setActiveTab('account')}>
                  <img src="https://picsum.photos/seed/customer/200" className="w-full h-full object-cover" />
               </div>
            </div>
         </header>

         <div className="text-center py-10">
            <div className="font-display italic text-amber-900 text-2xl leading-none">Kanti</div>
            <h1 className="text-5xl font-sans font-black text-stone-800 uppercase tracking-tighter leading-[0.85] mb-4">Bakes<br />& Flakes</h1>
            <div className="flex items-center justify-center gap-2 mb-8">
               <div className="px-3 py-1 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Makar Sankranti Specials</div>
            </div>
            <p className="font-sans font-bold text-stone-400 uppercase text-[9px] tracking-[0.3em]">Legacy Unit of <span className="text-amber-900 italic font-display lowercase text-base">Kanti Sweets</span></p>
         </div>

         <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 mb-10 no-scrollbar">
            <div className="min-w-full snap-center bg-[#48c4e4] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-4 right-10 animate-float">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="rotate-45">
                     <rect x="5" y="5" width="30" height="30" fill="#f6e05e" />
                     <line x1="5" y1="5" x2="35" y2="35" stroke="white" strokeWidth="1" />
                     <line x1="35" y1="5" x2="5" y2="35" stroke="white" strokeWidth="1" />
                  </svg>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Kai Po Che 2025</p>
               <h2 className="text-3xl font-black leading-tight mb-8">Festive<br />Til-Gul Magic</h2>
               <button onClick={() => { setSelectedCategory('Sankranti Specials'); setCurrentScreen('category'); }} className="bg-white text-[#48c4e4] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg">Explore Specials</button>
            </div>
            <div className="min-w-full snap-center bg-[#ff1b6b] rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Heritage Gifting</p>
               <h2 className="text-3xl font-black leading-tight mb-8">Gifting with Love</h2>
               <button className="bg-white text-[#ff1b6b] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">Browse Valentine</button>
            </div>
         </div>

         <section className="mb-12">
            <div className="px-6 flex justify-between items-end mb-6">
               <div>
                  <h3 className="text-lg font-black text-stone-800 uppercase tracking-tighter">Sankranti Specials</h3>
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mt-1 border-b-2 border-orange-200 inline-block">Premium Selection</p>
               </div>
               <ChevronRight className="w-5 h-5 text-orange-600 p-1 bg-orange-50 rounded-full" />
            </div>
            <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-4 snap-x">
               {products.filter(p => p.category === 'Sankranti Specials').map(p => <ProductCardSmall key={p.id} product={p} />)}
            </div>
         </section>

         <section className="mb-12">
            <div className="px-6 flex justify-between items-end mb-6">
               <div>
                  <h3 className="text-lg font-black text-stone-800 uppercase tracking-tighter">Republic Delights</h3>
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mt-1 border-b-2 border-green-200 inline-block">75th Anniversary</p>
               </div>
               <ChevronRight className="w-5 h-5 text-green-600 p-1 bg-green-50 rounded-full" />
            </div>
            <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-4 snap-x">
               {products.filter(p => p.isFestive).map(p => <ProductCardSmall key={p.id} product={p} />)}
            </div>
         </section>
      </div>
   );

   const renderSearch = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative">
         <header className="px-6 pt-16 pb-6 border-b border-stone-50 flex items-center gap-4">
            <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <div className="flex-1 bg-stone-50 rounded-2xl flex items-center px-4 py-3">
               <input
                  autoFocus
                  type="text"
                  placeholder="Search sweets, chikki & more..."
                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
               />
               {searchQuery && <button onClick={() => handleSearch('')}><X className="w-4 h-4 text-stone-300" /></button>}
            </div>
         </header>

         <div className="p-6">
            {!searchQuery ? (
               <>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Trending Festive Searches</p>
                  <div className="flex flex-wrap gap-2">
                     {['Til Gul', 'Peanut Chikki', 'Sesame Cookies', 'Kite Gifting', 'Red Velvet'].map(tag => (
                        <button key={tag} onClick={() => handleSearch(tag)} className="px-5 py-2.5 rounded-full border border-stone-100 text-xs font-bold text-stone-600 hover:bg-orange-50 hover:border-orange-200 transition-all">{tag}</button>
                     ))}
                  </div>
               </>
            ) : (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-black text-stone-800 uppercase tracking-tighter">Search Results</h3>
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Found {searchResult.length} Matches</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {searchResult.map(p => <ProductCardSmall key={p.id} product={p} />)}
                  </div>
                  {searchResult.length === 0 && (
                     <div className="text-center py-20 opacity-30">
                        <Search className="w-16 h-16 mx-auto mb-4" />
                        <p className="font-bold">No matches found</p>
                        <p className="text-xs">Try searching for 'til gul' or 'biscuits'</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );

   const renderProfile = () => (
      <div className="animate-in fade-in duration-500 pb-32">
         <header className="px-8 pt-16 pb-8 flex justify-center">
            <div className="relative">
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-stone-50">
                  <img src="https://picsum.photos/seed/harshita/400" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-orange-600 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                  <UserIcon className="w-4 h-4" />
               </div>
            </div>
         </header>

         <div className="text-center px-8 mb-10">
            <h2 className="text-3xl font-sans font-black text-stone-800 leading-none mb-1">Harshita Sharma</h2>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">+91 98765 43210 • harshita@example.com</p>
         </div>

         <div className="px-8 grid grid-cols-2 gap-4 mb-10">
            <div className="bg-orange-50 rounded-[32px] p-6 text-center border border-orange-100 shadow-sm">
               <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1">Loyalty Points</p>
               <p className="text-3xl font-black text-orange-600">{user.points}</p>
            </div>
            <div className="bg-rose-50 rounded-[32px] p-6 text-center border border-rose-100 shadow-sm">
               <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1">Total Orders</p>
               <p className="text-3xl font-black text-rose-600">2</p>
            </div>
         </div>

         <div className="px-8 space-y-3">
            {[
               { id: 'history', label: 'My Orders', sub: '2 HISTORICAL ORDERS', icon: ShoppingCart, color: 'text-orange-600' },
               { id: 'wishlist', label: 'Wishlist', sub: '0 SAVED ITEMS', icon: Heart, color: 'text-rose-500' },
               { id: 'addresses', label: 'Saved Addresses', sub: '2 ADDRESSES', icon: MapPin, color: 'text-stone-400' },
               { id: 'payment', label: 'Payment Methods', sub: 'VISA •••• 4242', icon: Wallet, color: 'text-stone-400' },
               { id: 'settings', label: 'Settings', sub: 'PRIVACY & SECURITY', icon: Settings, color: 'text-stone-400' },
               { id: 'support', label: 'Support & FAQ', sub: 'GET HELP', icon: Info, color: 'text-stone-400' }
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => { if (item.id === 'history' || item.id === 'wishlist') setCurrentScreen(item.id as any); }}
                  className="w-full bg-white p-5 rounded-[28px] border border-stone-100 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
               >
                  <div className="flex items-center gap-5">
                     <div className={`p-3 bg-stone-50 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-stone-800 text-sm">{item.label}</p>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.sub}</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-200" />
               </button>
            ))}

            <button className="w-full mt-10 py-5 flex items-center justify-center gap-3 text-rose-600 font-black text-xs uppercase tracking-[0.2em]">
               <LogOut className="w-4 h-4" /> Logout Account
            </button>
            <div className="text-center pb-20">
               <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Kanti Bakes & Flakes v2.4.0</p>
               <p className="text-[8px] font-bold text-stone-200 uppercase tracking-[0.4em]">A LEGACY OF SWEETNESS SINCE 1957</p>
            </div>
         </div>
      </div>
   );

   const renderHistory = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative pb-20">
         <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md">
            <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Order History</h2>
         </header>
         <div className="p-6 space-y-4">
            {[
               { id: 'ORD-8291', date: '12 Feb, 2025', items: '1x Red Velvet Heart Cake, 1x Saffron Jeera Sticks', total: 845.50, status: 'DELIVERED' },
               { id: 'ORD-7721', date: '08 Feb, 2025', items: '1x Hazelnut Truffles', total: 320.00, status: 'DELIVERED' }
            ].map(ord => (
               <div key={ord.id} className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{ord.id}</p>
                        <p className="text-[10px] font-bold text-stone-400 mt-0.5">{ord.date}</p>
                     </div>
                     <Badge variant="success">{ord.status}</Badge>
                  </div>
                  <div className="space-y-1 mb-6">
                     {ord.items.split(', ').map(item => (
                        <p key={item} className="text-xs font-bold text-stone-600">{item}</p>
                     ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-stone-100">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Paid Amount</span>
                     <span className="text-xl font-black text-orange-700">₹{ord.total.toFixed(2)}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );

   const renderCheckout = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-bottom-20 duration-500 z-[300] relative flex flex-col">
         <header className="px-6 pt-16 pb-6 border-b border-stone-50 flex items-center gap-4">
            <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Confirm Delivery</h2>
         </header>
         <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            <div className="bg-orange-50 rounded-[32px] p-6 mb-8 flex items-center gap-5 border border-orange-100">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1">Heritage Delivery</p>
                  <p className="font-bold text-stone-900">Arriving at your door in 20 mins</p>
               </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 mb-10 flex items-center gap-3">
               <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
               <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">VALENTINE SPECIAL: SPREADING LOVE WITH ₹20 SAVINGS</p>
            </div>

            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Review Items</p>
            <div className="space-y-4 mb-12">
               {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">250g</p>
                        <p className="font-bold text-stone-800 text-sm truncate">{item.name}</p>
                        <p className="text-sm font-black text-orange-700 mt-1">₹{Math.round(item.price * 50)}</p>
                     </div>
                     <div className="flex items-center bg-stone-50 rounded-xl px-2 py-1 gap-3">
                        <button onClick={() => updateCartQuantity(item.id, -1)}><Minus className="w-3 h-3 text-stone-400" /></button>
                        <span className="text-xs font-bold text-stone-800">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)}><Plus className="w-3 h-3 text-orange-600" /></button>
                     </div>
                  </div>
               ))}
            </div>

            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Bill Details</p>
            <div className="space-y-3 bg-stone-50/50 p-6 rounded-[32px] border border-stone-100 mb-10">
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-stone-500">Item Total</span>
                  <span className="font-black text-stone-800">₹{itemsTotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-stone-500">CGST (2.5%)</span>
                  <span className="font-black text-stone-800">₹{cgst.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-stone-500">SGST (2.5%)</span>
                  <span className="font-black text-stone-800">₹{sgst.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-stone-500">Delivery Fee ({deliveryDistance.toFixed(1)} km)</span>
                  <span className="font-black text-orange-600">₹{deliveryFee.toFixed(2)}</span>
               </div>
               <div className="pt-4 border-t border-dashed border-stone-200 flex justify-between items-center">
                  <div className="flex flex-col">
                     <span className="text-[11px] font-black text-stone-900 uppercase">Total to Pay</span>
                     <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">INCL. ALL TAXES</span>
                  </div>
                  <span className="text-3xl font-black text-orange-700">₹{grandTotal.toFixed(2)}</span>
               </div>
            </div>
            <div className="text-center py-6">
               <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mb-4">HAND-PACKED WITH HERITAGE STANDARDS</p>
            </div>
         </div>
         <div className="p-6 bg-white border-t border-stone-50 sticky bottom-0">
            <button
               onClick={() => { placeOrder(deliveryMethod, {}); setCurrentScreen('history'); }}
               className="w-full bg-orange-700 text-white py-5 rounded-[28px] font-black text-base uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
               Confirm & Pay ₹{grandTotal.toFixed(0)}
            </button>
         </div>
      </div>
   );

   const renderCategoryDetail = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative">
         <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-4">
               <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
               <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">{selectedCategory}</h2>
            </div>
            <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Clear Filter</button>
         </header>
         <div className="p-6 grid grid-cols-2 gap-4">
            {products.filter(p => p.category === selectedCategory).map(p => <ProductCardSmall key={p.id} product={p} />)}
         </div>
      </div>
   );

   const LocationPicker = () => {
      // Default center (Bangalore)
      const defaultCenter = { lat: 12.9716, lng: 77.5946 };
      const [center, setCenter] = useState(defaultCenter);

      return (
         <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md flex items-end justify-center animate-in fade-in" onClick={() => setShowLocationPicker(false)}>
            <div className="bg-white w-full max-w-md rounded-t-[52px] animate-in slide-in-from-bottom-full duration-500 overflow-hidden flex flex-col h-[85vh]" onClick={e => e.stopPropagation()}>
               {/* Header */}
               <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white z-10 relative">
                  <div>
                     <h2 className="text-2xl font-black text-stone-800 uppercase tracking-tighter">Pin Location</h2>
                     <p className="text-xs font-bold text-stone-400">Drag map to adjust</p>
                  </div>
                  <button onClick={() => setShowLocationPicker(false)} className="p-3 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"><X className="w-5 h-5" /></button>
               </div>

               {/* Map Area */}
               <div className="flex-1 relative bg-stone-100">
                  <MapsWrapper>
                     <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={center}
                        zoom={15}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                        onDragEnd={() => { /* logic to update center state from map instance if needed, usually requires ref to map */ }}
                     >
                        {/* Center Pin Overlay (Static for UI, map moves behind it) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pb-8 pointer-events-none">
                           <MapPin className="w-10 h-10 text-orange-600 fill-orange-600 drop-shadow-2xl animate-bounce" />
                           <div className="w-4 h-1.5 bg-black/20 rounded-[100%] mx-auto blur-[1px]" />
                        </div>
                     </GoogleMap>
                  </MapsWrapper>

                  {/* Search Overlay */}
                  <div className="absolute top-4 left-4 right-4 shadow-lg rounded-[24px]">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input type="text" placeholder="Search area, street..." className="w-full pl-12 pr-4 py-4 bg-white rounded-[24px] text-sm font-bold shadow-sm outline-none" />
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-8 bg-white z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex p-1.5 bg-stone-50 rounded-[32px] mb-6 border border-stone-100">
                     <button onClick={() => setDeliveryMethod(DeliveryMethod.HOME_DELIVERY)} className={`flex-1 py-3.5 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all ${deliveryMethod === DeliveryMethod.HOME_DELIVERY ? 'bg-white shadow-lg text-orange-600' : 'text-stone-300'}`}>Delivery</button>
                     <button onClick={() => setDeliveryMethod(DeliveryMethod.PICKUP)} className={`flex-1 py-3.5 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all ${deliveryMethod === DeliveryMethod.PICKUP ? 'bg-white shadow-lg text-orange-600' : 'text-stone-300'}`}>Self Pickup</button>
                  </div>

                  <button
                     onClick={() => setShowLocationPicker(false)}
                     className="w-full bg-stone-900 text-white py-5 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                     Confirm Location
                  </button>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className="max-w-md mx-auto h-[100dvh] bg-[#fdfaf8] overflow-hidden shadow-2xl relative font-sans flex flex-col">
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {currentScreen === 'main' && (
               <>
                  {activeTab === 'home' && renderHome()}
                  {activeTab === 'festive' && (
                     <div className="animate-in fade-in duration-500">
                        <header className="px-6 pt-16 pb-8 border-b border-stone-50">
                           <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">Republic Special</h2>
                           <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Limited Celebration Series</p>
                        </header>
                        <div className="p-6 grid grid-cols-2 gap-4">
                           {products.filter(p => p.isFestive).map(p => <ProductCardSmall key={p.id} product={p} />)}
                        </div>
                     </div>
                  )}
                  {activeTab === 'account' && renderProfile()}
               </>
            )}
            {currentScreen === 'search' && renderSearch()}
            {currentScreen === 'wishlist' && (
               <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative">
                  <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center gap-4">
                     <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
                     <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Your Wishlist</h2>
                  </header>
                  <div className="p-12 text-center opacity-30 flex flex-col items-center">
                     <Heart className="w-16 h-16 mb-4 text-rose-500" />
                     <p className="font-bold">Your wishlist is empty</p>
                     <p className="text-xs">Save your favorites for later!</p>
                  </div>
               </div>
            )}
            {currentScreen === 'history' && renderHistory()}
            {currentScreen === 'category' && renderCategoryDetail()}
            {currentScreen === 'checkout' && renderCheckout()}
         </div>

         {/* Floating Checkout Bar */}
         {cart.length > 0 && currentScreen === 'main' && (
            <div className="fixed bottom-24 left-6 right-6 z-[100] animate-in slide-in-from-bottom-5">
               <div className="bg-orange-700 rounded-[32px] p-2 pl-6 flex items-center justify-between shadow-2xl">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center text-white text-[10px] font-black">{cart.length}</div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Kanti Basket</span>
                     </div>
                     <span className="text-white font-black text-xl">₹{itemsTotal.toFixed(0)}</span>
                  </div>
                  <button onClick={() => setCurrentScreen('checkout')} className="bg-white text-orange-700 px-8 py-4 rounded-[26px] font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2">
                     Checkout
                  </button>
               </div>
            </div>
         )}

         {/* Navigation */}
         <nav className="h-20 bg-white border-t border-stone-50 flex justify-around items-center px-6 sticky bottom-0 z-50">
            {[
               { id: 'home', icon: Home, label: 'Explore' },
               { id: 'festive', icon: Zap, label: 'Festive' },
               { id: 'account', icon: UserIcon, label: 'Account' }
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setCurrentScreen('main'); }}
                  className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-orange-600' : 'text-stone-300'}`}
               >
                  <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
               </button>
            ))}
         </nav>

         {showLocationPicker && <LocationPicker />}
         {selectedProduct && renderProductModal()}
      </div>
   );
};

const Zap = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const UserIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
