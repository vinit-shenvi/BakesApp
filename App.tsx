import React from 'react';
import { AdminDashboard } from './apps/AdminDashboard';
import { CustomerApp } from './apps/CustomerApp';
import { DeliveryApp } from './apps/DeliveryApp';
import { StoreProvider, useStore } from './storeContext';
import { LoginScreen } from './components/LoginScreen';

const AppContent = () => {
  const { isAuthenticated, userRole } = useStore();
  const [selectedApp, setSelectedApp] = React.useState<'customer' | 'admin' | 'delivery' | null>(null);

  if (!isAuthenticated) {
    if (selectedApp) {
      return <LoginScreen targetRole={selectedApp} onBack={() => setSelectedApp(null)} />;
    }

    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Choose App Portal</h1>
            <p className="text-stone-400 font-bold uppercase tracking-widest">Select the application you want to access</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer App Card */}
            <button onClick={() => setSelectedApp('customer')} className="bg-white hover:bg-orange-50 rounded-[32px] p-8 text-center transition-all hover:scale-105 group active:scale-95">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
              </div>
              <h3 className="text-xl font-black text-stone-800 uppercase tracking-tighter mb-2">Customer App</h3>
              <p className="text-xs font-bold text-stone-400">Order Sweets & Bakes</p>
            </button>

            {/* Delivery App Card */}
            <button onClick={() => setSelectedApp('delivery')} className="bg-white hover:bg-emerald-50 rounded-[32px] p-8 text-center transition-all hover:scale-105 group active:scale-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><path d="M15 18H9" /><circle cx="17" cy="18" r="2" /></svg>
              </div>
              <h3 className="text-xl font-black text-stone-800 uppercase tracking-tighter mb-2">Delivery Partner</h3>
              <p className="text-xs font-bold text-stone-400">Manage Orders & Trips</p>
            </button>

            {/* Admin App Card */}
            <button onClick={() => setSelectedApp('admin')} className="bg-white hover:bg-stone-50 rounded-[32px] p-8 text-center transition-all hover:scale-105 group active:scale-95">
              <div className="w-20 h-20 bg-stone-100 text-stone-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-stone-800 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 className="text-xl font-black text-stone-800 uppercase tracking-tighter mb-2">Admin Portal</h3>
              <p className="text-xs font-bold text-stone-400">Store Management</p>
            </button>
          </div>
          <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest opacity-50">Kanti Bakes & Flakes Ecosystem • v2.5.0</p>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, ensure they stay in their flow or are redirected correctly
  // (In a real app, this would be route based. Here we just show the component based on auth role)
  return (
    <div className="min-h-screen bg-white">
      {/* Admin Roles */}
      {['admin', 'super_admin', 'outlet_admin'].includes(userRole as string) && <AdminDashboard />}
      {userRole === 'customer' && <CustomerApp />}
      {userRole === 'delivery' && <DeliveryApp />}
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
