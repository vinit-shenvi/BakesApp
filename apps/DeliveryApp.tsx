
import React, { useState } from 'react';
import {
  Truck, CheckCircle2, Navigation, Phone, Wallet, Clock, MapPin,
  User as UserIcon, LogOut, ChevronRight, Activity, ArrowLeft, Package, Map as MapIcon, Power,
  // Added Home icon import
  Home
} from 'lucide-react';
import { useStore } from '../storeContext';
import { OrderStatus } from '../types';
import { Badge, Card, Button } from '../components/Shared';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapsWrapper } from '../components/MapsWrapper';

type ViewMode = 'LIST' | 'NAVIGATION';

export const DeliveryApp: React.FC = () => {
  const { user, deliveryPartners: partners, orders, togglePartnerStatus, updateOrderStatus, logout } = useStore();

  // Use logged-in user ID to identify the partner
  const partner = partners.find(p => p.id === user.id);

  const [activeTab, setActiveTab] = useState<'home' | 'earnings' | 'profile'>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'ACTIVE'>('ALL');

  // Simulation State
  const [driverPos, setDriverPos] = useState({ lat: 12.9716, lng: 77.5946 });
  const [deliveryPath, setDeliveryPath] = useState<google.maps.DirectionsResult | null>(null);

  if (!partner) return <div className="flex h-screen items-center justify-center">Loading Profile...</div>;

  // Filter orders: NEW (available to all) OR Assigned to Me (Active)
  // And ensure they are not delivered/cancelled
  const availableOrders = orders.filter(o =>
    (o.status === OrderStatus.NEW) ||
    (o.assignedPartnerId === partner.id && o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED)
  );

  const newOrdersCount = availableOrders.filter(t => t.status === OrderStatus.NEW).length;
  const activeOrdersCount = availableOrders.filter(t => t.status !== OrderStatus.NEW).length;

  // Apply visual filter
  const displayedTasks = availableOrders.filter(order => {
    if (filter === 'NEW') return order.status === OrderStatus.NEW;
    if (filter === 'ACTIVE') return order.status !== OrderStatus.NEW;
    return true;
  });

  const handleNavigate = (order: any) => {
    setSelectedOrder(order);
    setViewMode('NAVIGATION');
  };

  const handleAction = () => {
    if (selectedOrder.type === 'PICKUP') {
      // Logic for picked up
      updateOrderStatus(selectedOrder.id, OrderStatus.OUT_FOR_DELIVERY, partner.id);
    } else {
      // Logic for delivered
      updateOrderStatus(selectedOrder.id, OrderStatus.DELIVERED, partner.id);
    }
    setViewMode('LIST');
    setSelectedOrder(null);
  };

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      <header className="px-6 pt-12 pb-6 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Kanti Delivery</h1>
        <button
          onClick={() => togglePartnerStatus(partner.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${partner.status === 'ONLINE' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-400'}`}
        >
          <Power className="w-4 h-4" />
          <span className="text-xs font-bold">{partner.status === 'ONLINE' ? 'Online' : 'Offline'}</span>
        </button>
      </header>

      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => setFilter(filter === 'NEW' ? 'ALL' : 'NEW')}
          className={`rounded-2xl p-6 text-center shadow-lg transition-all ${filter === 'NEW' ? 'bg-stone-900 ring-2 ring-amber-500' : 'bg-black'} active:scale-95`}
        >
          <p className="text-4xl font-bold text-white mb-1">{newOrdersCount}</p>
          <p className={`text-xs font-bold ${filter === 'NEW' ? 'text-amber-500' : 'text-stone-400'}`}>New Orders</p>
        </button>
        <button
          onClick={() => setFilter(filter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          className={`rounded-2xl p-6 text-center border transition-all ${filter === 'ACTIVE' ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500' : 'bg-stone-100 border-stone-200'} active:scale-95`}
        >
          <p className={`text-4xl font-bold mb-1 ${filter === 'ACTIVE' ? 'text-amber-800' : 'text-stone-800'}`}>{activeOrdersCount}</p>
          <p className={`text-xs font-bold ${filter === 'ACTIVE' ? 'text-amber-700' : 'text-stone-500'}`}>Active</p>
        </button>
      </div>

      {filter !== 'ALL' && (
        <div className="px-6 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Showing {filter === 'NEW' ? 'New Requests' : 'Active Deliveries'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-24">
        {displayedTasks.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Truck className="w-16 h-16 mx-auto mb-4" />
            <p>No {filter === 'ALL' ? 'tasks' : filter.toLowerCase() + ' tasks'} found</p>
          </div>
        ) : displayedTasks.map(order => (
          <Card key={order.id} className="p-5 border-none shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{order.customerName}</h3>
                  <p className="text-stone-400 text-xs font-medium">{order.address || 'Location Verified'}</p>
                </div>
              </div>
              <div className="text-right">
                {/* Price hidden as per request */}
                <Badge variant={order.status === OrderStatus.NEW ? 'warning' : 'info'}>{order.status}</Badge>
              </div>
            </div>

            {/* Status-based Action Buttons */}
            <div className="flex gap-3">
              {order.status === OrderStatus.NEW ? (
                <button
                  onClick={() => updateOrderStatus(order.id, OrderStatus.ACCEPTED)}
                  className="flex-1 py-3.5 rounded-2xl bg-stone-800 text-white font-bold text-sm hover:bg-stone-900 transition-all"
                >
                  Accept Order
                </button>
              ) : null}

              {(order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.PREPARING || order.status === OrderStatus.READY) && (
                <button
                  onClick={() => updateOrderStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
                  className="flex-1 py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all"
                >
                  Pick Up
                </button>
              )}

              {(order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.PICKED_UP) && (
                <button
                  onClick={() => handleNavigate(order)}
                  className="flex-1 py-3.5 rounded-2xl bg-[#3498db] text-white font-bold text-sm hover:bg-[#2980b9] transition-all shadow-md"
                >
                  Navigate
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="h-full bg-stone-100 flex flex-col relative">
      <header className="absolute top-12 left-6 z-10">
        <button
          onClick={() => setViewMode('LIST')}
          className="p-3 bg-white rounded-full shadow-xl hover:bg-stone-50 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-stone-800" />
        </button>
      </header>

      <div className="flex-1 relative">
        <MapsWrapper>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={driverPos}
            zoom={14}
            options={{ disableDefaultUI: true, zoomControl: false }}
            onLoad={() => {
              // Simulate movement effect
              const interval = setInterval(() => {
                setDriverPos(prev => ({
                  lat: prev.lat + (Math.random() - 0.5) * 0.001,
                  lng: prev.lng + (Math.random() - 0.5) * 0.001
                }));
              }, 1000);
              return () => clearInterval(interval);
            }}
          >
            <Marker position={driverPos} icon={{ url: "https://maps.google.com/mapfiles/kml/shapes/truck.png", scaledSize: new google.maps.Size(30, 30) }} />
            {deliveryPath && <DirectionsRenderer directions={deliveryPath} />}
          </GoogleMap>
        </MapsWrapper>
      </div>

      <div className="bg-white rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 relative z-20 -mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">
              Delivering Order
            </h2>
            <p className="text-stone-400 text-sm font-medium mt-1">{selectedOrder.address}</p>
          </div>
          <div className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-black">
            #{selectedOrder.id}
          </div>
        </div>

        <button
          onClick={handleAction}
          className="w-full bg-[#2ecc71] text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-6 h-6" />
          Mark Delivered
        </button>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="flex flex-col h-full bg-[#f9f9f9] animate-in slide-in-from-right duration-300">
      <header className="px-6 pt-12 pb-6 bg-white flex justify-between items-end border-b border-stone-100">
        <div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
          <h1 className="text-4xl font-black text-stone-900 mt-1">₹4,250<span className="text-lg text-stone-400">.50</span></h1>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black uppercase">
          +12% vs last week
        </div>
      </header>

      <div className="p-6 overflow-y-auto pb-24">
        <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 snap-x">
          {[
            { label: 'Today', value: '₹850', active: true },
            { label: 'Yesterday', value: '₹1,200', active: false },
            { label: 'This Week', value: '₹8,400', active: false }
          ].map((stat, i) => (
            <div key={i} className={`min-w-[120px] p-4 rounded-[24px] border snap-center ${stat.active ? 'bg-stone-800 text-white border-stone-800 shadow-xl' : 'bg-white text-stone-400 border-stone-200'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-stone-800 mb-4">Recent Payouts</h3>
        <div className="space-y-4">
          {[
            { id: 'TXN-9821', date: 'Today, 2:30 PM', amount: 45.0, type: 'Delivery Fee' },
            { id: 'TXN-9820', date: 'Today, 1:15 PM', amount: 85.0, type: 'Delivery Fee + Tip' },
            { id: 'TXN-9819', date: 'Yesterday', amount: 1200.0, type: 'Weekly Settlement' }
          ].map(txn => (
            <div key={txn.id} className="bg-white p-5 rounded-[24px] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">{txn.type}</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{txn.date}</p>
                </div>
              </div>
              <span className={`font-black ${txn.amount > 1000 ? 'text-stone-800' : 'text-emerald-600'}`}>
                {txn.amount > 1000 ? '-' : '+'}₹{txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#f9f9f9] animate-in slide-in-from-right duration-300">
      <header className="pt-12 pb-8 bg-white text-center rounded-b-[40px] shadow-sm relative z-10">
        <div className="w-24 h-24 bg-stone-100 rounded-full mx-auto mb-4 border-4 border-white shadow-xl overflow-hidden">
          <img src="https://picsum.photos/seed/rider/200" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-black text-stone-800">{partner.name}</h2>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">ID: {partner.id} • {partner.phone}</p>
        <div className="flex justify-center gap-2 mt-6">
          <div className="px-4 py-2 bg-stone-50 rounded-xl">
            <p className="text-[10px] font-black text-stone-400 uppercase">Rating</p>
            <div className="flex items-center gap-1">
              <span className="font-bold text-stone-800">4.8</span>
              <Activity className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
          <div className="px-4 py-2 bg-stone-50 rounded-xl">
            <p className="text-[10px] font-black text-stone-400 uppercase">Deliveries</p>
            <span className="font-bold text-stone-800">1,240</span>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto pb-24 space-y-4">
        <div className="bg-orange-500 text-white p-6 rounded-[32px] relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Achievement Unlocked</p>
            <h3 className="text-2xl font-black italic">Speed Racer</h3>
            <p className="text-xs font-medium mt-1 opacity-90">Completed 50 deliveries under 20 mins this month!</p>
          </div>
          <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-orange-400 opacity-50" />
        </div>

        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Settings</p>
        {[
          { label: 'Vehicle Details', val: 'Splendor Plus • KA 01 EQ 1234', icon: Truck },
          { label: 'Shift Schedule', val: '10:00 AM - 08:00 PM', icon: Clock },
          { label: 'Preferences', val: 'Vegetarian Orders Only', icon: CheckCircle2 }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-[24px] flex items-center gap-4 border border-stone-100">
            <div className="w-10 h-10 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-stone-800 text-sm">{item.label}</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">{item.val}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        ))}

        <button
          onClick={logout}
          className="w-full py-4 mt-8 text-rose-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-white overflow-hidden shadow-2xl flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'LIST' ? (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'earnings' && renderEarnings()}
            {activeTab === 'profile' && renderProfile()}
          </>
        ) : (
          renderNavigation()
        )}
      </div>

      {viewMode === 'LIST' && (
        <nav className="h-20 bg-white border-t border-stone-100 flex justify-around items-center px-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-emerald-600' : 'text-stone-300'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'earnings' ? 'text-emerald-600' : 'text-stone-300'}`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] font-bold">Earnings</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-emerald-600' : 'text-stone-300'}`}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};
