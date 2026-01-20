
import React, { useState } from 'react';
import { useStore } from '../storeContext';
import { Lock, User, Truck, ShoppingBag, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
    targetRole?: 'admin' | 'customer' | 'delivery';
    onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ targetRole, onBack }) => {
    const { login, register, deliveryPartners } = useStore();
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up (only for customer)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // For Sign Up

    // If targetRole is provided, use it. Otherwise default to customer.
    // For admin, we need sub-roles: 'super_admin' | 'outlet_admin'
    const [adminRole, setAdminRole] = useState<'super_admin' | 'outlet_admin'>('outlet_admin');

    // Base role state (legacy compat)
    const [role, setRole] = useState<'admin' | 'customer' | 'delivery'>(targetRole || 'customer');

    // OTP State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (role === 'customer') {
            if (!showOtpInput) {
                if (phone.length < 10) {
                    alert("Please enter a valid phone number");
                    return;
                }
                // Simulate sending OTP
                setShowOtpInput(true);
                alert(`OTP sent to ${phone}. Use 1234 to login.`);
            } else {
                // Verify OTP
                if (otp === '1234') {
                    login(phone, 'customer');
                } else {
                    alert('Invalid OTP');
                }
            }
            return;
        }

        if (role === 'delivery') {
            // Validate credentials against deliveryPartners
            const partner = deliveryPartners.find(p => p.email === email && p.password === password);

            if (partner) {
                login(email, 'delivery');
            } else {
                alert('Invalid Email or Password');
            }
            return;
        }

        if (role === 'admin') {
            // Pass the specific admin sub-role
            login(email, adminRole);
        } else {
            login(email, role);
        }
    };

    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500 relative">
                {onBack && (
                    <button onClick={onBack} className="absolute top-8 left-8 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-stone-600" />
                    </button>
                )}

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-amber-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform">
                        <h1 className="text-4xl">🥐</h1>
                    </div>
                    <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">
                        {role === 'customer' ? 'Welcome' : 'Welcome Back'}
                    </h2>
                    <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-2">{targetRole ? `${targetRole} Portal` : 'Select Portal'}</p>
                </div>

                {/* Role Switcher (Hidden if targetRole is passed, except for expanding admin options maybe?) */}
                {!targetRole && (
                    <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-8">
                        <button onClick={() => setRole('customer')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white shadow-md text-orange-600' : 'text-stone-400'}`}>Customer</button>
                        <button onClick={() => setRole('delivery')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'delivery' ? 'bg-white shadow-md text-emerald-600' : 'text-stone-400'}`}>Delivery</button>
                        <button onClick={() => setRole('admin')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white shadow-md text-stone-800' : 'text-stone-400'}`}>Admin</button>
                    </div>
                )}

                {/* Admin Sub-Role Switcher */}
                {(role === 'admin' || targetRole === 'admin') && (
                    <div className="flex bg-stone-50 p-1 rounded-xl mb-6 border border-stone-200">
                        <button onClick={() => setAdminRole('outlet_admin')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${adminRole === 'outlet_admin' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>Outlet Admin</button>
                        <button onClick={() => setAdminRole('super_admin')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${adminRole === 'super_admin' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>Super Admin</button>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">

                    {role === 'customer' ? (
                        <>
                            {!showOtpInput ? (
                                <div className="relative animate-in slide-in-from-right">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-4 font-bold text-stone-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all font-mono tracking-widest"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="relative animate-in slide-in-from-right">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter OTP (1234)"
                                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-4 font-bold text-stone-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all font-mono tracking-[0.5em] text-center text-lg"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={4}
                                        autoFocus
                                    />
                                    <p className="text-center text-xs font-bold text-stone-400 mt-2">Sent to {phone}</p>
                                </div>
                            )}

                            <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 active:scale-95 transition-all shadow-xl mt-4">
                                {showOtpInput ? 'Verify & Login' : 'Send OTP'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-4 font-bold text-stone-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-4 font-bold text-stone-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 active:scale-95 transition-all shadow-xl mt-4">
                                {`Login to ${role === 'admin' ? (adminRole === 'super_admin' ? 'Head Office' : 'Store') : (targetRole || role)}`}
                            </button>
                        </>
                    )}
                </form>

                <div className="mt-8 pt-8 border-t border-stone-100 text-center">
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Kanti Bakes & Flakes Ecosystem</p>
                </div>
            </div>
        </div>
    );
};
