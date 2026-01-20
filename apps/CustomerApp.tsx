import React, { useState } from 'react';
import {
   Search, Heart, ShoppingBag, MapPin, Star, Plus, Minus, ArrowRight,
   User as UserIcon, Settings, ChevronRight, Info, X, Home, Filter, Phone, LogOut, ArrowLeft,
   CheckCircle2, Clock, Wallet, CreditCard, ChevronDown, ShoppingCart
} from 'lucide-react';
import { GoogleMap } from '@react-google-maps/api';
import { MapsWrapper } from '../components/MapsWrapper';
import { useStore } from '../storeContext';
import { CATEGORIES } from '../constants';
import { Badge, Card, Button } from '../components/Shared';
import { DeliveryMethod, OrderStatus, Product, Order } from '../types';
import { generateInvoice } from '../utils/invoiceGenerator';

const STORES = [
   { id: 's1', name: 'HSR Layout Kitchen', address: 'Sector 7, HSR, Bangalore', dist: 1.2 },
   { id: 's2', name: 'Koramangala Outpost', address: '80 Feet Road, 4th Block', dist: 3.5 },
   { id: 's3', name: 'Indiranagar Flagship', address: '12th Main, Indiranagar', dist: 5.8 }
];

export const CustomerApp: React.FC = () => {
   const { products, user, addToCart: addToCartAction, cart, updateCartQuantity, removeFromCart, wishlist, toggleWishlist, deliverySettings, placeOrder, logout, calculateDeliveryFee } = useStore();

   const [activeTab, setActiveTab] = useState<'home' | 'match' | 'account'>('home');
   const [currentScreen, setCurrentScreen] = useState<'main' | 'category' | 'product' | 'cart' | 'checkout' | 'profile' | 'history' | 'wishlist' | 'addresses' | 'payment'>('main');
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

   // Local state for addresses and payments
   const [addresses, setAddresses] = useState([
      { id: 'addr1', label: 'Home', val: 'Flat 402, Krishna Heights, Attibele', active: true },
      { id: 'addr2', label: 'Office', val: 'Tech Park, Electronic City', active: false }
   ]);
   const [payments, setPayments] = useState([
      { id: 'pay1', label: 'HDFC Credit Card', val: '•••• 4242', icon: CreditCard, active: true },
      { id: 'pay2', label: 'UPI', val: 'harshita@okhdfcbank', icon: Phone, active: false }
   ]);

   const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.HOME_DELIVERY);
   const [showLocationPicker, setShowLocationPicker] = useState(false);
   const [showAddressSearch, setShowAddressSearch] = useState(false); // New: Address Search Modal
   const [selectedStore, setSelectedStore] = useState(STORES[0]);
   const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default center (Bangalore)

   const [searchQuery, setSearchQuery] = useState('');
   const [searchResult, setSearchResult] = useState<Product[]>([]);

   // Order Details
   const [receiverDetails, setReceiverDetails] = useState({ name: '', phone: '' });

   // Profile Edit State
   const [isEditingProfile, setIsEditingProfile] = useState(false);
   const [profileData, setProfileData] = useState({
      name: 'Harshita Sharma',
      phone: '+91 98765 43210',
      email: 'harshita@example.com',
      dob: '1998-05-24'
   });

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
      // New: Local state for selected variant (default to first or main product)
      const [selectedVariant, setSelectedVariant] = useState(
         (product.variants && product.variants.length > 0) ? product.variants[0] : null
      );

      const isWished = wishlist.includes(product.id);

      // Determine Display Values
      const displayPrice = selectedVariant ? selectedVariant.price : product.price;
      const displayWeight = selectedVariant ? selectedVariant.weight : '250g'; // Fallback or standard

      return (
         <div onClick={() => setSelectedProduct(product)} className="bg-white rounded-[28px] p-3 shadow-sm border border-stone-100/50 flex flex-col relative w-44 flex-shrink-0 snap-center cursor-pointer active:scale-95 transition-transform h-[280px]">
            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 rounded-full shadow-sm">
               <Heart className={`w-3 h-3 ${isWished ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`} />
            </button>
            <div className="h-28 rounded-2xl overflow-hidden mb-2 bg-stone-50 flex-shrink-0">
               <img src={product.image} className="w-full h-full object-cover" />
            </div>
            <div className="px-1 flex-1 flex flex-col">
               <h4 className="font-bold text-stone-800 text-sm line-clamp-1 mb-1">{product.name}</h4>

               {/* Variants Chips */}
               {product.variants && product.variants.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mb-2">
                     {product.variants.map((v, idx) => (
                        <button
                           key={idx}
                           onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                           className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${selectedVariant?.id === v.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-stone-400 border-stone-200'}`}
                        >
                           {v.weight}
                        </button>
                     ))}
                  </div>
               ) : (
                  <div className="flex items-center gap-1 mb-2">
                     <div className="w-2 h-2 border border-emerald-600 flex items-center justify-center p-[1px]"><div className="w-1 h-1 bg-emerald-600 rounded-full" /></div>
                     <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Standard</span>
                  </div>
               )}

               <div className="mt-auto flex items-center justify-between">
                  <span className="font-extrabold text-stone-900 text-sm">₹{displayPrice}</span>
                  {!cartItem ? (
                     <button onClick={(e) => { e.stopPropagation(); addToCartAction({ ...product, price: displayPrice, name: `${product.name} (${displayWeight})` }); }} className="bg-white border border-orange-500 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Add</button>
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
         {/* T20 Header */}
         <div className="bg-indigo-900 py-1.5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            <div className="animate-marquee whitespace-nowrap text-white text-[9px] font-black uppercase tracking-[0.3em] relative z-10">
               ICC T20 WORLD CUP 2026 • LIVE SCREENING AT ALL OUTLETS • CRICKET FEVER IS ON • CHEER FOR INDIA • SPECIAL MATCH DAY MENU •
            </div>
         </div>

         <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl border-b border-indigo-50 z-50">
            <button onClick={() => setShowLocationPicker(true)} className="flex flex-col items-start group">
               <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">KANTI EXPRESS - 20MINS</span>
                  <ChevronDown className="w-3 h-3 text-indigo-600" />
               </div>
               <p className="font-bold text-stone-900 text-[13px]">
                  {deliveryMethod === DeliveryMethod.HOME_DELIVERY ? 'Home - HSR Layout' : selectedStore.name}
               </p>
            </button>
            <div className="flex items-center gap-3">
               <button onClick={() => setCurrentScreen('search')} className="p-2.5 bg-indigo-50 rounded-full text-indigo-600"><Search className="w-5 h-5" /></button>
               <div className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-md overflow-hidden" onClick={() => setActiveTab('account')}>
                  <img src="https://picsum.photos/seed/customer/200" className="w-full h-full object-cover" />
               </div>
            </div>
         </header>

         {/* Hero Section - Upcoming Match Card */}
         <div className="relative py-8 px-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>

            <div className="relative z-10 text-center">
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
                  <Clock className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Starts 07 Feb • 7:30 PM</span>
               </div>

               {/* Match Face-Off Card */}
               <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] mb-8 shadow-2xl transform transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-center text-white mb-6">
                     <div className="text-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-xl mx-auto mb-2 border-2 border-blue-500 ring-4 ring-blue-500/20">🇮🇳</div>
                        <p className="font-black text-lg uppercase tracking-wider">India</p>
                     </div>
                     <div className="text-center px-2">
                        <div className="text-3xl font-black text-white/20 italic">VS</div>
                     </div>
                     <div className="text-center">
                        <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-xl mx-auto mb-2 border-2 border-green-800 ring-4 ring-yellow-400/20">🇦🇺</div>
                        <p className="font-black text-lg uppercase tracking-wider">Australia</p>
                     </div>
                  </div>

                  {/* Countdown Timer Mockup */}
                  <div className="flex justify-center gap-3">
                     {['07', '14', '32'].map((time, idx) => (
                        <div key={idx} className="text-center">
                           <div className="bg-gradient-to-b from-indigo-800 to-indigo-950 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                              <span className="font-mono text-xl font-bold text-white">{time}</span>
                           </div>
                           <span className="text-[8px] font-black text-indigo-300 uppercase mt-1 block">{['Days', 'Hrs', 'Mins'][idx]}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <h1 className="text-3xl font-sans font-black text-white italic uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">
                  Get Match Ready!
               </h1>
               <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-0">Pre-order match snacks now</p>
            </div>
         </div>

         {/* Dynamic Sliding Background Promo */}
         <div className="mx-5 mb-10 relative overflow-hidden rounded-[32px] bg-indigo-600 shadow-2xl h-48 group">
            {/* Sliding Background Pattern */}
            <div className="absolute inset-0 opacity-10 flex animate-marquee whitespace-nowrap">
               <span className="text-6xl font-black mx-4 text-white">🏏 🥤 🌭 🏏 🥤 🌭 🏏 🥤 🌭</span>
               <span className="text-6xl font-black mx-4 text-white">🏏 🥤 🌭 🏏 🥤 🌭 🏏 🥤 🌭</span>
               <span className="text-6xl font-black mx-4 text-white">🏏 🥤 🌭 🏏 🥤 🌭 🏏 🥤 🌭</span>
               <span className="text-6xl font-black mx-4 text-white">🏏 🥤 🌭 🏏 🥤 🌭 🏏 🥤 🌭</span>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
               <div className="inline-block bg-yellow-400 text-indigo-900 border-2 border-indigo-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest -rotate-2 mb-2 shadow-[4px_4px_0px_0px_rgba(49,46,129,1)]">
                  Limited Time Offer
               </div>
               <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-md mb-2">
                  Powerplay<br />Snacking
               </h2>
               <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4">Get 20% off during match hours</p>
               <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:bg-orange-400 hover:text-white transition-colors">
                  View Menu
               </button>
            </div>
         </div>

         <section className="mb-12">
            <div className="px-6 flex justify-between items-end mb-6 cursor-pointer" onClick={() => { setSelectedCategory('Sankranti Specials'); setCurrentScreen('category'); }}>
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
            <div className="px-6 flex justify-between items-end mb-6 cursor-pointer" onClick={() => { setSelectedCategory('Cricket World Cup'); setCurrentScreen('category'); }}>
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
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-indigo-50">
                  <img src="https://picsum.photos/seed/harshita/400" className="w-full h-full object-cover" />
               </div>
               <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="absolute -bottom-2 -right-2 bg-indigo-600 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors"
               >
                  {isEditingProfile ? <CheckCircle2 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
               </button>
            </div>
         </header>

         {/* Editable Profile Section */}
         <div className="px-8 mb-10">
            {isEditingProfile ? (
               <div className="space-y-4 bg-white p-6 rounded-[32px] border border-indigo-100 shadow-xl">
                  {/* Read Only Fields */}
                  <div>
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Full Name (Locked)</label>
                     <input type="text" value={profileData.name} disabled className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-500 font-bold text-sm cursor-not-allowed" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Mobile Number (Locked)</label>
                     <input type="text" value={profileData.phone} disabled className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-500 font-bold text-sm cursor-not-allowed" />
                  </div>

                  {/* Editable Fields */}
                  <div>
                     <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Email Address</label>
                     <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-stone-800 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Date of Birth</label>
                        <input
                           type="date"
                           value={profileData.dob}
                           onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                           className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-stone-800 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Fav Team</label>
                        <select
                           value={profileData.favTeam}
                           onChange={(e) => setProfileData({ ...profileData, favTeam: e.target.value })}
                           className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-stone-800 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                        >
                           <option>India</option> <option>Australia</option> <option>England</option> <option>South Africa</option>
                        </select>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="text-center">
                  <h2 className="text-3xl font-sans font-black text-indigo-900 leading-none mb-1">{profileData.name}</h2>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{profileData.phone}</p>
                  <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                     <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{profileData.email}</span>
                  </div>
               </div>
            )}
         </div>

         <div className="px-8 grid grid-cols-2 gap-4 mb-10">
            <div className="bg-indigo-50 rounded-[32px] p-6 text-center border border-indigo-100 shadow-sm">
               <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1">T20 Runs (Pts)</p>
               <p className="text-3xl font-black text-indigo-600">{user.points}</p>
            </div>
            <div className="bg-blue-50 rounded-[32px] p-6 text-center border border-blue-100 shadow-sm">
               <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Matches (Orders)</p>
               <p className="text-3xl font-black text-blue-600">2</p>
            </div>
         </div>

         <div className="px-8 space-y-3">
            {[
               { id: 'history', label: 'Match Orders', sub: '2 HISTORICAL ORDERS', icon: ShoppingCart, color: 'text-indigo-600' },
               { id: 'wishlist', label: 'Fav Players (Wishlist)', sub: `${wishlist.length} SAVED ITEMS`, icon: Heart, color: 'text-rose-500' },
               { id: 'addresses', label: 'Stadium Seats (Addresses)', sub: '2 LOCATIONS', icon: MapPin, color: 'text-stone-400' },
               { id: 'payment', label: 'Payment Methods', sub: 'VISA •••• 4242', icon: Wallet, color: 'text-stone-400' },
               { id: 'settings', label: 'Settings', sub: 'PRIVACY & SECURITY', icon: Settings, color: 'text-stone-400' },
               { id: 'support', label: 'Umpire Call (Support)', sub: 'GET HELP', icon: Info, color: 'text-stone-400' }
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => {
                     if (['history', 'wishlist', 'addresses', 'payment'].includes(item.id)) {
                        setCurrentScreen(item.id as any);
                     }
                  }}
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

            <button
               onClick={logout}
               className="w-full mt-10 py-5 flex items-center justify-center gap-3 text-rose-600 font-black text-xs uppercase tracking-[0.2em]"
            >
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
                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-stone-100 mb-4">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Paid Amount</span>
                     <span className="text-xl font-black text-orange-700">₹{ord.total.toFixed(2)}</span>
                  </div>
                  <button
                     onClick={() => {
                        // Mock conversion to Order object for the generator since history items here are simplified
                        const mockOrder: Order = {
                           id: ord.id,
                           customerName: user.name,
                           customerPhone: '+91 98765 43210',
                           address: 'Saved Location', // Placeholder
                           items: [], // Placeholder as items string is flat
                           total: ord.total,
                           status: OrderStatus.DELIVERED,
                           method: DeliveryMethod.HOME_DELIVERY,
                           timestamp: new Date().toISOString(),
                           paymentStatus: 'PAID'
                        };
                        generateInvoice(mockOrder);
                     }}
                     className="w-full py-3 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                     Download Invoice
                  </button>
               </div>
            ))}
         </div>
      </div>
   );

   const renderAddressSearch = () => (
      <div className="fixed inset-0 z-[2002] bg-stone-50 animate-in slide-in-from-bottom duration-300 flex flex-col">
         {/* Header */}
         <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-stone-100 shadow-sm sticky top-0 z-10">
            <h2 className="text-lg font-black text-stone-800">Your Location</h2>
            <button onClick={() => setShowAddressSearch(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><X className="w-5 h-5 text-stone-600" /></button>
         </div>

         {/* Search Input */}
         <div className="px-6 py-4 bg-white">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
               <input
                  autoFocus
                  type="text"
                  placeholder="Search a new address"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
               />
            </div>
         </div>

         {/* Current Location */}
         <div className="mx-6 mt-4 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <MapPin className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-bold text-rose-500 text-sm">Use My Current Location</h4>
                  <p className="text-[10px] text-stone-400 font-bold">Enable location for better services</p>
               </div>
            </div>
            <button className="px-4 py-2 border border-rose-200 text-rose-500 rounded-lg text-xs font-black shadow-sm" onClick={() => {
               // Mock adding current location
               setAddresses([...addresses, { id: `addr${Date.now()}`, label: 'Home - Current', val: '12th Main, Indiranagar, Bangalore', active: false }]);
               setShowAddressSearch(false);
            }}>Enable</button>
         </div>

         {/* Mock Results */}
         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Nearby Locations</p>
            {[
               { name: 'You and Me', addr: 'Shankar Nagar Road, Raipur' },
               { name: 'You and Me Coliving PG', addr: 'Pattandur Agrahara, Whitefield' },
               { name: 'You and Me Foundation', addr: 'Royal Colony, Balapur' },
               { name: 'Hotel You and Me Rooms', addr: 'Opp. Kosad Lake Garden, Surat' }
            ].map((place, idx) => (
               <button
                  key={idx}
                  onClick={() => {
                     setAddresses([...addresses, { id: `addr${Date.now()}`, label: place.name, val: place.addr, active: false }]);
                     setShowAddressSearch(false);
                  }}
                  className="w-full text-left bg-white p-4 rounded-2xl border border-stone-100 flex items-start gap-4 hover:border-orange-200 hover:shadow-md transition-all group"
               >
                  <div className="mt-1 w-8 h-8 rounded-full bg-stone-50 flex-shrink-0 flex items-center justify-center text-stone-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                     <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="font-bold text-stone-800 text-sm">{place.name}</p>
                     <p className="text-xs text-stone-400 font-medium line-clamp-1">{place.addr}</p>
                  </div>
               </button>
            ))}
         </div>
      </div>
   );

   const renderAddresses = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative pb-20">
         <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md">
            <button onClick={() => setCurrentScreen('profile')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Saved Addresses</h2>
         </header>
         <div className="p-6 space-y-4">
            {addresses.map(addr => (
               <div key={addr.id} className={`p-5 rounded-[24px] border flex items-center justify-between ${addr.active ? 'border-orange-500 bg-orange-50' : 'border-stone-100 bg-white'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${addr.active ? 'bg-orange-500 text-white' : 'bg-stone-50 text-stone-400'}`}>
                        <MapPin className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="font-bold text-stone-800 text-sm">{addr.label}</p>
                        <p className="text-xs font-bold text-stone-400 mt-0.5">{addr.val}</p>
                     </div>
                  </div>
                  {addr.active && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
               </div>
            ))}
            <button
               onClick={() => setShowAddressSearch(true)}
               className="w-full py-4 border-2 border-dashed border-stone-200 rounded-[24px] text-stone-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-orange-200 hover:text-orange-500 transition-all"
            >
               <Plus className="w-5 h-5" /> Add New Address
            </button>
         </div>
      </div>
   );

   const renderPaymentMethods = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative pb-20">
         <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md">
            <button onClick={() => setCurrentScreen('profile')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Payment Methods</h2>
         </header>
         <div className="p-6 space-y-4">
            {payments.map(pay => (
               <div key={pay.id} className={`p-5 rounded-[24px] border flex items-center justify-between ${pay.active ? 'border-emerald-500 bg-emerald-50' : 'border-stone-100 bg-white'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pay.active ? 'bg-emerald-500 text-white' : 'bg-stone-50 text-stone-400'}`}>
                        <pay.icon className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="font-bold text-stone-800 text-sm">{pay.label}</p>
                        <p className="text-xs font-bold text-stone-400 mt-0.5">{pay.val}</p>
                     </div>
                  </div>
                  {pay.active && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
               </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-stone-200 rounded-[24px] text-stone-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-emerald-200 hover:text-emerald-500 transition-all">
               <Plus className="w-5 h-5" /> Add New Card
            </button>
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

            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Receiver Details</p>
            <div className="space-y-4 mb-12">
               <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 block">Name</label>
                  <input
                     type="text"
                     placeholder="Receiver's Name"
                     className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-200"
                     value={receiverDetails.name}
                     onChange={(e) => setReceiverDetails({ ...receiverDetails, name: e.target.value })}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                  <input
                     type="tel"
                     placeholder="Receiver's Contact"
                     className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-200"
                     value={receiverDetails.phone}
                     onChange={(e) => setReceiverDetails({ ...receiverDetails, phone: e.target.value })}
                  />
               </div>
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
               onClick={() => { placeOrder(deliveryMethod, {}, receiverDetails); setCurrentScreen('history'); }}
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

   const renderWishlist = () => (
      <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300 z-[200] relative">
         <header className="px-6 pt-16 pb-8 border-b border-stone-50 flex items-center gap-4">
            <button onClick={() => setCurrentScreen('main')}><ArrowLeft className="w-6 h-6 text-orange-600" /></button>
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Your Wishlist</h2>
         </header>
         {wishlist.length === 0 ? (
            <div className="p-12 text-center opacity-30 flex flex-col items-center">
               <Heart className="w-16 h-16 mb-4 text-rose-500" />
               <p className="font-bold">Your wishlist is empty</p>
               <p className="text-xs">Save your favorites for later!</p>
            </div>
         ) : (
            <div className="p-6 grid grid-cols-2 gap-4">
               {products.filter(p => wishlist.includes(p.id)).map(p => <ProductCardSmall key={p.id} product={p} />)}
            </div>
         )}
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
            {currentScreen === 'wishlist' && renderWishlist()}

            {currentScreen === 'addresses' && renderAddresses()}
            {showAddressSearch && renderAddressSearch()}
            {currentScreen === 'payment' && renderPaymentMethods()}
            {currentScreen === 'history' && renderHistory()}
            {currentScreen === 'category' && renderCategoryDetail()}
            {currentScreen === 'checkout' && renderCheckout()}

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

            {showLocationPicker && <LocationPicker />}
            {selectedProduct && renderProductModal()}
         </div>
         {/* Navigation */}
         <nav className="h-20 bg-white border-t border-stone-50 flex justify-around items-center px-6 sticky bottom-0 z-50">
            {[
               { id: 'home', icon: Home, label: 'Explore' },
               { id: 'festive', icon: Star, label: 'Festive' },
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
      </div>
   );
};
