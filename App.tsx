
import React, { useState } from 'react';
import { StoreProvider } from './storeContext';
import { CustomerApp } from './apps/CustomerApp';
import { AdminDashboard } from './apps/AdminDashboard';
import { DeliveryApp } from './apps/DeliveryApp';
import { AppRole } from './types';
import { Smartphone, Monitor, Bike } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole | null>(AppRole.ADMIN);

  if (!role) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-display text-stone-800 mb-4">Bakes & Flakes</h1>
            <p className="text-stone-500 text-lg">Select your portal to enter the bakery ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PortalCard
              title="Customer App"
              desc="Browse & Order Sweets"
              icon={Smartphone}
              color="bg-amber-600"
              onClick={() => setRole(AppRole.CUSTOMER)}
            />
            <PortalCard
              title="Admin Dashboard"
              desc="Manage Business & Orders"
              icon={Monitor}
              color="bg-stone-800"
              onClick={() => setRole(AppRole.ADMIN)}
            />
            <PortalCard
              title="Delivery App"
              desc="Track & Fulfill Deliveries"
              icon={Bike}
              color="bg-emerald-600"
              onClick={() => setRole(AppRole.DELIVERY)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <div className="relative">
        {/* Portal Switcher (Demo Only) */}
        <div className="fixed top-4 right-4 z-[9999] flex gap-2">
          <button
            onClick={() => setRole(null)}
            className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border hover:bg-white transition-colors flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            DEMO: SWITCH ROLE
          </button>
        </div>

        {role === AppRole.CUSTOMER && <CustomerApp />}
        {role === AppRole.ADMIN && <AdminDashboard />}
        {role === AppRole.DELIVERY && <DeliveryApp />}
      </div>
    </StoreProvider>
  );
};

const PortalCard = ({ title, desc, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="group bg-white p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all border border-stone-100 flex flex-col items-center text-center transform hover:-translate-y-2"
  >
    <div className={`w-20 h-20 ${color} rounded-3xl flex items-center justify-center text-white mb-6 transform rotate-3 group-hover:rotate-0 transition-transform shadow-lg`}>
      <Icon className="w-10 h-10" />
    </div>
    <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    <div className="mt-8 flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
      Enter Now <ChevronRight className="w-4 h-4" />
    </div>
  </button>
);

const ChevronRight = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

export default App;
