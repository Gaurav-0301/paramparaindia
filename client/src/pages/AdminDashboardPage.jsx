import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, Package, Tag, MessageSquare, Download, Plus, Edit, Trash2, CheckCircle, RefreshCw, Crown, Sparkles, Layers
} from 'lucide-react';
import axios from 'axios';
import { useFestival } from '../context/FestivalContext';

const AdminDashboardPage = () => {
  const { refetchFestival } = useFestival();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, orders, coupons, reviews, festival

  // Analytics data
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Orders data
  const [adminOrders, setAdminOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Products data
  const [adminProducts, setAdminProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'Rakhis',
    subCategory: '',
    price: '',
    mrp: '',
    availableQuantity: 50,
    sku: '',
    badge: 'Rakhi Special',
    images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80']
  });

  // Coupons data
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 499,
    totalUsageLimit: 1000
  });

  // Reviews data
  const [adminReviews, setAdminReviews] = useState([]);

  // Festival config state
  const [festivals, setFestivals] = useState([]);
  const [selectedFestivalKey, setSelectedFestivalKey] = useState('raksha-bandhan');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchAdminOrders();
    if (activeTab === 'products') fetchAdminProducts();
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'reviews') fetchAdminReviews();
    if (activeTab === 'festival') fetchFestivals();
  }, [activeTab, orderStatusFilter]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await axios.get('/api/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch admin analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchAdminOrders = async () => {
    setLoadingOrders(true);
    try {
      let url = `/api/admin/orders?status=${orderStatusFilter}`;
      const res = await axios.get(url);
      setAdminOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAdminProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get('/api/products?limit=100');
      setAdminProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/coupons/admin/all');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    }
  };

  const fetchAdminReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/admin/all');
      setAdminReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const fetchFestivals = async () => {
    try {
      const res = await axios.get('/api/festival/admin/all');
      setFestivals(res.data.festivals || []);
    } catch (err) {
      console.error('Failed to fetch festival configs:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      fetchAdminOrders();
      fetchAnalytics();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/admin/orders/export-csv?status=${orderStatusFilter}`, '_blank');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/products/admin/${editingProduct._id}`, productForm);
      } else {
        await axios.post('/api/products/admin/create', productForm);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchAdminProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await axios.delete(`/api/products/admin/${id}`);
      fetchAdminProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/coupons/admin/create', couponForm);
      setShowCouponModal(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await axios.delete(`/api/coupons/admin/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  const handleSwitchFestival = async (festivalKey) => {
    try {
      const res = await axios.post('/api/festival/admin/switch', { festivalKey });
      alert(`Switched active festival theme to ${res.data.festival?.title || festivalKey}`);
      await fetchFestivals();
      if (refetchFestival) await refetchFestival();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to switch festival theme');
    }
  };

  const COLORS = ['#9CAF97', '#D4B896', '#3A342E', '#E8D3CE', '#A0AEC0'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#3A342E] text-[#D4B896] flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Parampara Admin Command Center</h1>
            <p className="text-xs text-[#3A342E]/70">Manage live dropshipping catalog, orders, coupons, and festival theme</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4 text-[#D4B896]" /> Export Orders CSV
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#EFE6D8] overflow-x-auto pb-2">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: LayoutDashboard },
          { id: 'orders', label: 'Order Fulfillment', icon: Package },
          { id: 'products', label: 'Catalog Manager', icon: ShoppingBag },
          { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
          { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
          { id: 'festival', label: 'Multi-Festival Engine', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#3A342E] text-[#FAF7F2] shadow-sm'
                  : 'glass-panel text-[#3A342E] hover:border-[#D4B896]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4B896]" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Analytics Dashboard Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* KPI Stat Cards */}
          {loadingAnalytics ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-24 bg-white/50 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40">
                <span className="text-[10px] uppercase font-bold text-[#9CAF97] tracking-wider">Total Orders</span>
                <p className="font-serif-display text-2xl font-semibold text-[#3A342E] mt-1">{analytics?.kpis?.totalOrdersCount || 0}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40">
                <span className="text-[10px] uppercase font-bold text-[#9CAF97] tracking-wider">Total Revenue</span>
                <p className="font-serif-display text-2xl font-semibold text-[#3A342E] mt-1">₹{(analytics?.kpis?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40">
                <span className="text-[10px] uppercase font-bold text-[#9CAF97] tracking-wider">Pending COD</span>
                <p className="font-serif-display text-2xl font-semibold text-[#3A342E] mt-1">₹{(analytics?.kpis?.pendingCodRevenue || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40">
                <span className="text-[10px] uppercase font-bold text-[#9CAF97] tracking-wider">Registered Shoppers</span>
                <p className="font-serif-display text-2xl font-semibold text-[#3A342E] mt-1">{analytics?.kpis?.uniqueCustomersCount || 0}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40">
                <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Low Stock Alerts</span>
                <p className="font-serif-display text-2xl font-semibold text-[#3A342E] mt-1">{analytics?.kpis?.lowStockCount || 0}</p>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Revenue Line Chart */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-4">
              <h3 className="font-serif-display text-lg font-semibold text-[#3A342E]">Daily Revenue Trajectory (₹)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.dailyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" />
                    <XAxis dataKey="_id" stroke="#3A342E" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#3A342E" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FAF7F2', borderColor: '#D4B896', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#9CAF97" strokeWidth={3} dot={{ fill: '#D4B896' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Donut Chart */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-4">
              <h3 className="font-serif-display text-lg font-semibold text-[#3A342E]">Order Status Split</h3>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.statusBreakdown || []}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {(analytics?.statusBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FAF7F2', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. Order Fulfillment Tab */}
      {activeTab === 'orders' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Customer Orders</h2>

            <div className="flex items-center gap-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-[#D4B896]/60 bg-white text-xs font-semibold text-[#3A342E]"
              >
                <option value="All">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#3A342E] text-white text-xs uppercase font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#D4B896]" /> Export CSV
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#3A342E]">
              <thead className="bg-[#FAF7F2] uppercase text-[10px] font-bold text-[#D4B896] tracking-wider border-b border-[#EFE6D8]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total (INR)</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6D8]">
                {adminOrders.map(order => (
                  <tr key={order._id} className="hover:bg-white/50">
                    <td className="p-3 font-mono font-bold">{order.orderId}</td>
                    <td className="p-3">
                      <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                      <p className="text-[10px] text-[#3A342E]/60">{order.shippingAddress?.mobile}</p>
                    </td>
                    <td className="p-3">{order.orderItems?.length} item(s)</td>
                    <td className="p-3 font-semibold">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D4B896]/40 text-[10px] font-semibold">
                        {order.paymentMethod} ({order.paymentDetails?.status})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#9CAF97]/20 text-[#3A342E]">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="px-2 py-1 rounded border border-[#D4B896]/50 bg-white text-[11px] font-semibold"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Catalog Manager Tab */}
      {activeTab === 'products' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Product Catalog</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', description: '', category: 'Rakhis', subCategory: '', price: '', mrp: '', availableQuantity: 50, sku: '', badge: 'Rakhi Special', images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80'] });
                setShowProductModal(true);
              }}
              className="px-4 py-2 bg-[#3A342E] text-white text-xs uppercase font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#D4B896]" /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminProducts.map(product => (
              <div key={product._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-3 flex gap-4">
                <img src={product.images[0]} alt="" className="w-20 h-24 object-cover rounded-xl bg-[#FAF7F2]" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-display font-semibold text-sm text-[#3A342E] line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-[#3A342E]/60">{product.category}</p>
                    <p className="text-xs font-bold text-[#3A342E] mt-1">₹{product.price} (Stock: {product.availableQuantity})</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm(product);
                        setShowProductModal(true);
                      }}
                      className="p-1.5 rounded bg-amber-50 text-amber-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-1.5 rounded bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Coupons & Discounts Tab */}
      {activeTab === 'coupons' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Discount Coupons</h2>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-[#3A342E] text-white text-xs uppercase font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#D4B896]" /> Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map(coupon => (
              <div key={coupon._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#3A342E]">{coupon.code}</span>
                  <button onClick={() => handleDeleteCoupon(coupon._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#9CAF97] font-bold">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                </p>
                <p className="text-[11px] text-[#3A342E]/60">Min Order: ₹{coupon.minOrderAmount} • Used {coupon.timesUsed} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Festival Engine Tab */}
      {activeTab === 'festival' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4B896]" /> Dynamic Multi-Festival Theme Engine
              </h2>
              <p className="text-xs text-[#3A342E]/70 mt-1">
                Instantly switch paramparaindia.shop for Raksha Bandhan, Diwali, Karwa Chauth, Bhai Dooj, or Holi.
              </p>
            </div>
            <button
              onClick={fetchFestivals}
              className="px-3 py-1.5 bg-white border border-[#D4B896]/50 rounded-xl text-xs font-semibold text-[#3A342E] flex items-center gap-1.5 hover:bg-[#FAF7F2]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#9CAF97]" /> Refresh Themes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map(fest => (
              <div
                key={fest.festivalKey || fest._id}
                className={`p-4 rounded-2xl border transition-all ${
                  fest.isActive
                    ? 'bg-white border-[#9CAF97] ring-2 ring-[#9CAF97]/50 shadow-md'
                    : 'bg-white/70 border-[#EFE6D8]'
                } space-y-3 relative`}
              >
                {fest.isActive && (
                  <span className="absolute top-6 right-6 z-10 px-2.5 py-1 rounded-full bg-[#9CAF97] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active Live Theme
                  </span>
                )}
                <div className="aspect-video rounded-xl overflow-hidden bg-stone-100">
                  <img src={fest.bannerImage} alt={fest.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-serif-display font-semibold text-base text-[#3A342E]">{fest.title}</h3>
                  <p className="text-xs text-[#3A342E]/70 line-clamp-1 mt-0.5">{fest.tagline}</p>
                </div>
                <button
                  onClick={() => handleSwitchFestival(fest.festivalKey)}
                  disabled={fest.isActive}
                  className={`w-full py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                    fest.isActive
                      ? 'bg-[#9CAF97]/20 text-[#9CAF97] cursor-default font-bold'
                      : 'bg-[#3A342E] text-[#FAF7F2] hover:bg-[#9CAF97]'
                  }`}
                >
                  {fest.isActive ? 'Active Theme' : 'Activate Theme'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowProductModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4">
            <h3 className="font-serif-display text-xl font-semibold text-[#3A342E]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 uppercase font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#3A342E] text-white uppercase font-semibold rounded-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCouponModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-md glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4">
            <h3 className="font-serif-display text-xl font-semibold text-[#3A342E]">Create Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code (e.g. FESTIVE15)</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCouponModal(false)} className="px-4 py-2 uppercase font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#3A342E] text-white uppercase font-semibold rounded-lg">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
