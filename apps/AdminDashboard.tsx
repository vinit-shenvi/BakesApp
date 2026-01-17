
import React, { useState } from 'react';
import {
  BarChart3, LayoutDashboard, Package, ShoppingCart, Users, Truck, Settings, Plus, Search,
  MoreVertical, Filter, TrendingUp, Calendar, AlertCircle, CheckCircle2, Map as MapIcon, ChevronRight,
  Clock, XCircle, CreditCard, Gift, MousePointer2, Bell, X, UserPlus, Phone, ShieldCheck, ArrowLeft, Activity, Trash, Edit
} from 'lucide-react';
import { useStore } from '../storeContext';
import { OrderStatus, DeliveryMethod, DeliveryTier } from '../types';
import { Badge, Card, Button } from '../components/Shared';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', sales: 400, orders: 24 },
  { name: 'Tue', sales: 300, orders: 18 },
  { name: 'Wed', sales: 500, orders: 35 },
  { name: 'Thu', sales: 280, orders: 20 },
  { name: 'Fri', sales: 590, orders: 48 },
  { name: 'Sat', sales: 800, orders: 75 },
  { name: 'Sun', sales: 700, orders: 60 },
];

export const AdminDashboard: React.FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { orders, products, deliveryPartners, updateOrderStatus, addPartner } = useStore();
  const [activeView, setActiveView] = useState<'overview' | 'orders' | 'products' | 'delivery' | 'festivals' | 'customers' | 'settings' | 'order_details'>('overview');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null); // For editing logic

  // Onboarding Form State
  const [newRider, setNewRider] = useState({ name: '', phone: '', bloodGroup: '' });

  const filteredOrders = orderFilter === 'ALL' ? (orders || []) : (orders || []).filter(o => o.status === orderFilter);

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRider.name && newRider.phone && newRider.bloodGroup) {
      addPartner(newRider);
      setNewRider({ name: '', phone: '', bloodGroup: '' });
      setShowOnboarding(false);
      // In a real app we'd show a toast here
      alert(`Rider ${newRider.name} onboarded successfully!`);
    }
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
    <button
      onClick={() => setActiveView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === id ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-100'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <Badge variant={trend > 0 ? 'success' : 'error'}>{trend > 0 ? '+' : ''}{trend}%</Badge>
      </div>
      <p className="text-stone-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-stone-800 mt-1">{value}</h3>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value="$12,450" trend={12} icon={TrendingUp} color="bg-amber-100 text-amber-600" />
        <StatCard label="Today's Orders" value={(orders || []).length} trend={5} icon={ShoppingCart} color="bg-blue-100 text-blue-600" />
        <StatCard label="Active Partners" value={(deliveryPartners || []).filter(p => p.status === 'ONLINE').length} trend={2} icon={Truck} color="bg-emerald-100 text-emerald-600" />
        <StatCard label="Customer Points" value="84,200" trend={-3} icon={Users} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Revenue Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#d97706" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Order Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="orders" fill="#8b4513" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Live Orders</h3>
          <Button variant="outline" className="text-sm" onClick={() => setActiveView('orders')}>View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-amber-700">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-stone-800">{order.customerName}</div>
                    <div className="text-xs text-stone-400">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    <div className="flex items-center gap-1">
                      {order.method === DeliveryMethod.HOME_DELIVERY ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      {order.method}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={order.status === OrderStatus.NEW ? 'warning' : 'success'}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-stone-800">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border overflow-x-auto max-w-full">
          {(['ALL', ...Object.values(OrderStatus)] as const).map(status => (
            <button
              key={status}
              onClick={() => setOrderFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${orderFilter === status ? 'bg-amber-600 text-white' : 'text-stone-500 hover:bg-stone-50'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <ShoppingCart className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedOrderId(order.id); setActiveView('order_details'); }}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      {order.id}
                    </button>
                    <Badge variant={order.status === OrderStatus.NEW ? 'warning' : order.status === OrderStatus.DELIVERED ? 'success' : 'info'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-stone-800 font-bold">{order.customerName}</p>
                  <p className="text-xs text-stone-400">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 items-center text-sm">
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Method</p>
                  <p className="font-bold flex items-center gap-1">{order.method === DeliveryMethod.HOME_DELIVERY ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />} {order.method}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Payment</p>
                  <p className="font-bold flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> {order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Total</p>
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === OrderStatus.NEW && (
                    <Button onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)} className="text-xs py-2">Start Preparing</Button>
                  )}
                  {order.status === OrderStatus.PREPARING && (
                    <Button onClick={() => updateOrderStatus(order.id, OrderStatus.READY)} className="text-xs py-2">Mark Ready</Button>
                  )}
                  {order.status === OrderStatus.READY && order.method === DeliveryMethod.HOME_DELIVERY && (
                    <Button onClick={() => updateOrderStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)} className="text-xs py-2">Assign Fleet</Button>
                  )}
                  <Button variant="outline" className="p-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-xs">
                <p className="text-stone-400 font-bold uppercase mb-2">Order Items</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-stone-50 p-2 rounded-xl border">
                      <img src={item.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-stone-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs">
                <p className="text-stone-400 font-bold uppercase mb-2">Delivery Details</p>
                <p className="text-stone-800">{order.address}</p>
                {order.assignedPartnerId && (
                  <p className="mt-1 text-amber-600 font-bold">Driver: {deliveryPartners.find(p => p.id === order.assignedPartnerId)?.name}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border opacity-50">
            <Search className="w-12 h-12 mx-auto mb-4" />
            <p>No orders found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return <div className="p-8">Order not found</div>;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
        <div className="flex items-center gap-4">
          <Button variant="danger" className="text-sm px-4 py-2" onClick={() => { setActiveView('orders'); setSelectedOrderId(null); }}>Back</Button>
          <h2 className="text-2xl font-bold">Order Details</h2>
        </div>

        {/* Summary Card */}
        <Card className="p-8">
          <h3 className="font-bold text-lg mb-6">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">Order ID</p>
              <p className="font-black text-stone-800">{order.id}</p>
              <p className="text-sm font-bold text-stone-500 mb-1 mt-4">Order Source</p>
              <p className="font-medium text-stone-800">Mobile App</p>
              <p className="text-sm font-bold text-stone-500 mb-1 mt-4">Shipping Charge</p>
              <p className="font-medium text-stone-800">₹{order.shippingCharge || 0}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">Status</p>
              <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'warning'}>{order.status}</Badge>
              <p className="text-sm font-bold text-stone-500 mb-1 mt-4">Order Type</p>
              <Badge variant="primary" className="flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Delivery</Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">Ordered At</p>
              <p className="font-medium text-stone-800">{new Date(order.timestamp).toLocaleString()}</p>
              <p className="text-sm font-bold text-stone-500 mb-1 mt-4">Total</p>
              <p className="font-black text-xl text-stone-800">₹{order.total}</p>
            </div>
          </div>
        </Card>

        {/* Items Table */}
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Order Items</h3>
            <Button className="bg-stone-900 text-white text-xs">Invoice</Button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 text-stone-500 text-sm">
                <th className="py-3 font-bold">Product</th>
                <th className="py-3 font-bold">Variant</th>
                <th className="py-3 font-bold">Qty</th>
                <th className="py-3 font-bold text-right">Price</th>
                <th className="py-3 font-bold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/50">
              {order.items.map(item => (
                <tr key={item.id}>
                  <td className="py-4 font-medium text-stone-800">{item.name}</td>
                  <td className="py-4 text-stone-500">Standard</td>
                  <td className="py-4 text-stone-800">{item.quantity}</td>
                  <td className="py-4 text-right text-stone-600">₹{item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-stone-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="py-4 text-right space-y-2">
                  <div className="flex justify-between max-w-xs ml-auto">
                    <span className="text-stone-500 text-sm">Tax</span>
                    <span className="font-bold">₹{order.tax || 0}</span>
                  </div>
                  <div className="flex justify-between max-w-xs ml-auto">
                    <span className="text-stone-500 text-sm">Shipping Charge</span>
                    <span className="font-bold">₹{order.shippingCharge || 0}</span>
                  </div>
                  <div className="flex justify-between max-w-xs ml-auto pt-2 border-t border-stone-100">
                    <span className="text-stone-800 font-bold">Total</span>
                    <span className="font-black text-xl">₹{order.total}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8">
            <h3 className="font-bold text-lg mb-6">Customer & Address</h3>
            <div className="space-y-6">
              <div>
                <span className="font-bold text-stone-800">Customer:</span> <span className="text-stone-600 mb-1">{order.customerName}</span>
                <span className="text-stone-400 text-xs ml-2">({order.customerPhone})</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-sm text-stone-800 mb-1">Billing Address</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{order.address}</p>
                  <p className="text-xs text-stone-500 mt-1">Contact: ({order.customerPhone})</p>
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-800 mb-1">Shipping Address</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{order.address}</p>
                  <p className="text-xs text-stone-500 mt-1">Contact: ({order.customerPhone})</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-6">Payment Details</h3>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-bold text-sm text-stone-800">Status</p>
                  <p className="text-xs text-stone-500 uppercase">{order.paymentStatus}</p>
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-800">Transaction ID</p>
                  <p className="text-xs text-stone-500">{order.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-800">Payment Time</p>
                  <p className="text-xs text-stone-500">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-bold text-lg mb-6">Store Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-sm text-stone-800 mb-1">Store Name: Attibele</p>
                <p className="text-xs text-stone-500">Store Code: 122 / 66131</p>
                <p className="text-xs text-stone-500">Store Type: OUTLET</p>
                <p className="text-xs text-stone-500">Status: ACTIVE</p>
              </div>
              <div>
                <p className="font-bold text-sm text-stone-800 mb-1">Store Address</p>
                <p className="text-xs text-stone-500 leading-relaxed">Attibele, Kanti Sweets Pvt Ltd, No 1, , Chinnanna Gowda Complex, Anekal Main road, BENGALURU, Karnataka, 562107, India</p>
                <p className="text-xs text-stone-500 mt-1">Contact: (Srinivas M V / 8884197411)</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-bold text-lg mb-6">Order Activity</h3>
            <div className="relative border-l-2 border-stone-100 ml-3 space-y-8">
              {(order.activityLog || []).map((log, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-stone-200 border-2 border-white"></div>
                  <p className="text-xs text-stone-400 mb-1">{new Date(log.timestamp).toLocaleString()}</p>
                  <p className="font-bold text-stone-800">{log.status}</p>
                  {log.message && <p className="text-xs text-stone-500 mt-0.5">{log.message}</p>}
                </div>
              ))}
              {(!order.activityLog || order.activityLog.length === 0) && <p className="text-sm text-stone-400 pl-8">No activity recorded yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    );
  };


  const renderFestivals = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Festive & Campaign Hub</h2>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> New Campaign</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-0 overflow-hidden">
          <div className="h-48 bg-stone-800 relative">
            <img src="https://picsum.photos/seed/cricket_banner/800/400" className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <Badge variant="primary" className="w-fit mb-2">ACTIVE</Badge>
              <h3 className="text-white text-3xl font-display">Cricket World Cup 2026</h3>
              <p className="text-amber-400 font-bold">Special Edition Menu Live</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Campaign Duration</span>
              <span className="font-bold text-sm">15 Mar - 30 Apr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Linked Products</span>
              <span className="font-bold text-sm">12 Items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Campaign Revenue</span>
              <span className="font-bold text-amber-600 text-sm">$4,250.00</span>
            </div>
            <hr />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Edit Campaign</Button>
              <Button variant="danger" className="flex-1">Deactivate</Button>
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="h-48 bg-stone-800 relative">
            <img src="https://picsum.photos/seed/sankranti_banner/800/400" className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <Badge variant="warning" className="w-fit mb-2">SCHEDULED</Badge>
              <h3 className="text-white text-3xl font-display">Sankranti Specials 🌾</h3>
              <p className="text-amber-400 font-bold">Launching in 5 Days</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Campaign Duration</span>
              <span className="font-bold text-sm">10 Jan - 20 Jan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Linked Products</span>
              <span className="font-bold text-sm">8 Items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Projected Sales</span>
              <span className="font-bold text-amber-600 text-sm">$1,800.00</span>
            </div>
            <hr />
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">Activate Now</Button>
              <Button variant="outline" className="flex-1">Manage Products</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-amber-600 text-white">
          <Gift className="w-8 h-8 mb-4 opacity-80" />
          <h4 className="font-bold text-lg mb-1">Coupon Generator</h4>
          <p className="text-sm text-amber-100 mb-6">Create festive specific discount codes for your customers.</p>
          <Button variant="secondary" className="w-full bg-white text-amber-700 hover:bg-amber-50 border-none">Create Coupon</Button>
        </Card>
        <Card className="p-6 bg-stone-800 text-white">
          <MousePointer2 className="w-8 h-8 mb-4 opacity-80" />
          <h4 className="font-bold text-lg mb-1">Banner Manager</h4>
          <p className="text-sm text-stone-400 mb-6">Upload and schedule promotional banners for the home screen.</p>
          <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">Manage Media</Button>
        </Card>
        <Card className="p-6 bg-emerald-600 text-white">
          <BarChart3 className="w-8 h-8 mb-4 opacity-80" />
          <h4 className="font-bold text-lg mb-1">Impact Analytics</h4>
          <p className="text-sm text-emerald-100 mb-6">Track how much revenue each festival is bringing to your bakery.</p>
          <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">View Stats</Button>
        </Card>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(products || []).map(p => (
          <Card key={p.id} className="p-4 flex gap-4 hover:border-amber-200 transition-colors">
            <img src={p.image} className="w-24 h-24 rounded-xl object-cover" alt="" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-stone-800 leading-tight">{p.name}</h3>
                <button className="text-stone-400 hover:text-stone-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <p className="text-[10px] text-stone-500 mb-2 uppercase font-bold tracking-wider">{p.category}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-amber-700 text-lg">${p.price}</span>
                <div className="flex gap-1">
                  {p.isBestSeller && <Badge variant="primary">HOT</Badge>}
                  {p.isFestive && <Badge variant="info">FESTIVE</Badge>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
        <Card className="p-6 flex-1 flex flex-col bg-stone-100 relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <MapIcon className="w-64 h-64" />
          </div>
          <div className="z-10 flex flex-col h-full">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-bold text-stone-800">Fleet Map (Live)</h3>
              <Badge variant="success">{(deliveryPartners || []).filter(p => p.status === 'ONLINE').length} DRIVERS ACTIVE</Badge>
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MapIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-500 font-medium">Interactive Fleet Tracking System</p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto mt-2">Simulating real-time geolocation of active delivery partners across the city.</p>
              </div>
            </div>
          </div>
          {/* Simulation markers */}
          <div className="absolute top-1/4 left-1/3 bg-amber-600 p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
            <Truck className="w-4 h-4 text-white" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold whitespace-nowrap">Rahul</div>
          </div>
          <div className="absolute top-2/3 right-1/4 bg-emerald-600 p-2 rounded-full shadow-lg border-2 border-white">
            <Truck className="w-4 h-4 text-white" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold whitespace-nowrap">Amit</div>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Fleet Status</h3>
          <Button variant="primary" className="text-xs p-2 flex items-center gap-1" onClick={() => setShowOnboarding(true)}>
            <UserPlus className="w-4 h-4" /> Onboard Rider
          </Button>
        </div>
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto no-scrollbar pb-10">
          {(deliveryPartners || []).map(p => (
            <Card key={p.id} className="p-4 hover:shadow-md transition-all group border-l-4 border-transparent hover:border-l-amber-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center relative shadow-inner">
                    <Users className="w-5 h-5 text-stone-600" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${p.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-stone-400'}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{p.name}</p>
                      {p.bloodGroup && <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-1 rounded">{p.bloodGroup}</span>}
                    </div>
                    <p className="text-xs text-stone-500">{p.phone}</p>
                  </div>
                </div>
                <Badge variant={p.status === 'ONLINE' ? 'success' : 'primary'}>{p.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-2 bg-stone-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                  <p className="text-stone-400 text-[8px] uppercase font-bold tracking-widest">Score</p>
                  <p className="font-bold text-amber-600">{p.performanceScore}</p>
                </div>
                <div className="text-center p-2 bg-stone-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                  <p className="text-stone-400 text-[8px] uppercase font-bold tracking-widest">Active Tasks</p>
                  <p className="font-bold">{orders.filter(o => o.partnerId === p.id && o.status !== OrderStatus.DELIVERED).length}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );


  const renderCustomers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Database</h2>
        <Button variant="outline" className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Export CSV</Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Loyalty Tier</th>
              <th className="px-6 py-4 font-semibold text-right">Lifetime Value</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {[
              { id: 1, name: 'Harshita Sharma', email: 'harshita@example.com', phone: '+91 98765 43210', tier: 'GOLD', spent: 12450, status: 'Active' },
              { id: 2, name: 'Vinit S.', email: 'vinit@example.com', phone: '+91 91234 56789', tier: 'SILVER', spent: 5320, status: 'Active' },
              { id: 3, name: 'Rahul K.', email: 'rahul@example.com', phone: '+91 88888 77777', tier: 'BRONZE', spent: 1200, status: 'Inactive' },
            ].map(cust => (
              <tr key={cust.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <span className="font-bold text-stone-800">{cust.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">
                  <p>{cust.email}</p>
                  <p className="text-xs">{cust.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={cust.tier === 'GOLD' ? 'warning' : cust.tier === 'SILVER' ? 'secondary' : 'primary'}>{cust.tier}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-bold text-stone-800">₹{cust.spent}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={cust.status === 'Active' ? 'success' : 'error'}>{cust.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold">Platform Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-amber-600" /> Store Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <div>
                <p className="font-bold text-stone-700 text-sm">Accepting Orders</p>
                <p className="text-xs text-stone-400">Toggle store availability</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <div>
                <p className="font-bold text-stone-700 text-sm">Auto-Assign Deliveries</p>
                <p className="text-xs text-stone-400">AI based driver allocation</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-600" /> Notifications</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <div>
                <p className="font-bold text-stone-700 text-sm">New Order Alert</p>
                <p className="text-xs text-stone-400">Sound and popup notifications</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <div>
                <p className="font-bold text-stone-700 text-sm">Low Stock Warnings</p>
                <p className="text-xs text-stone-400">Alert when inventory is low</p>
              </div>
              <div className="w-10 h-6 bg-stone-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden relative font-sans">
      {/* Rider Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-300 relative shadow-2xl">
            <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-2 hover:bg-stone-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display text-stone-800">Rider Onboarding</h3>
              <p className="text-stone-500 text-sm">Add a new delivery partner to the fleet</p>
            </div>

            <form onSubmit={handleOnboard} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sameer Khanna"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl border focus:ring-2 focus:ring-amber-200 focus:border-amber-600 outline-none transition-all"
                    value={newRider.name}
                    onChange={(e) => setNewRider(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 00000-00000"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl border focus:ring-2 focus:ring-amber-200 focus:border-amber-600 outline-none transition-all"
                    value={newRider.phone}
                    onChange={(e) => setNewRider(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Blood Group</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <select
                    required
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl border focus:ring-2 focus:ring-amber-200 focus:border-amber-600 outline-none transition-all appearance-none"
                    value={newRider.bloodGroup}
                    onChange={(e) => setNewRider(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  >
                    <option value="" disabled>Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">By onboarding, this rider will gain access to the Bakes & Flakes Delivery App and be eligible for automatic task assignments.</p>
              </div>
              <Button type="submit" className="w-full py-4 text-lg">Activate Rider Profile</Button>
              <button type="button" onClick={() => setShowOnboarding(false)} className="w-full py-2 text-stone-400 text-sm font-bold hover:text-stone-600 transition-colors">Cancel</button>
            </form>
          </Card>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-100 flex flex-col p-6 overflow-y-auto z-10 hidden md:flex h-full">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-600/20">B</div>
          <span className="text-xl font-display text-stone-800 tracking-tight">Bakes & Flakes</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem id="overview" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="orders" label="Order Manager" icon={ShoppingCart} />
          <SidebarItem id="products" label="Products" icon={Package} />
          <SidebarItem id="delivery" label="Fleet Tracking" icon={Truck} />
          <SidebarItem id="festivals" label="Festive Hub" icon={Calendar} />
          <div className="pt-8 pb-4 px-2">
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Business</p>
          </div>
          <SidebarItem id="users" label="Customers" icon={Users} />
          <SidebarItem id="settings" label="Config" icon={Settings} />
        </nav>

        <div className="mt-auto pt-8 border-t border-stone-100">
          <div className="bg-stone-50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://picsum.photos/seed/admin/100" alt="" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Bakery Owner</p>
              <p className="text-[10px] text-stone-500">Super Admin</p>
            </div>
            <button className="text-stone-400 hover:text-amber-600 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4 bg-stone-100 px-4 py-2 rounded-xl w-96 hidden md:flex">
            <Search className="w-4 h-4 text-stone-400" />
            <input type="text" placeholder="Search for orders, partners..." className="bg-transparent focus:outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <p className="text-xs font-bold text-stone-800">{orders.filter(o => o.status === OrderStatus.NEW).length} Pending Tasks</p>
              <p className="text-[10px] text-amber-600 font-bold">{orders.filter(o => o.status === OrderStatus.READY).length} Orders waiting pickup</p>
            </div>
            <button className="relative p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#fafafa]">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'orders' && renderOrders()}
          {activeView === 'order_details' && renderOrderDetails()}
          {activeView === 'products' && renderProducts()}
          {activeView === 'delivery' && renderDelivery()}
          {activeView === 'festivals' && renderFestivals()}
          {activeView === 'users' && renderCustomers()}
          {activeView === 'settings' && renderSettings()}
          {activeView === 'reports' && (
            <div className="flex flex-col items-center justify-center py-40 opacity-50">
              <BarChart3 className="w-16 h-16 mb-4" />
              <p className="text-lg font-bold">Module "{activeView}" coming soon</p>
              <p className="text-sm">We are cooking something special for this module!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const LogOut = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const Store = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zm8-10a1 1 0 00-1-1h-4a1 1 0 00-1 1v10a1 1 0 001 1h4a1 1 0 001-1V6z" /></svg>;
