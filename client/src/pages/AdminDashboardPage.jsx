import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, Package, Tag, MessageSquare, Download, Plus, Edit, Trash2, CheckCircle, RefreshCw, Crown, Sparkles, Layers, Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { useFestival } from '../context/FestivalContext';

const AdminDashboardPage = () => {
  const { refetchFestival } = useFestival();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, orders, products, categories, coupons, reviews, festival

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
    subCategory: 'Bracelet & Combo Rakhi',
    price: '',
    mrp: '',
    availableQuantity: 50,
    sku: '',
    badge: 'Rakhi Special',
    images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80']
  });

  // Categories data
  const [adminCategories, setAdminCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    parentCategory: 'Rakhis',
    image: '',
    description: '',
    displayOrder: 0,
    isActive: true
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
    fetchAdminCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchAdminOrders();
    if (activeTab === 'products') fetchAdminProducts();
    if (activeTab === 'categories') fetchAdminCategories();
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

  const fetchAdminCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get('/api/categories?activeOnly=false');
      setAdminCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoadingCategories(false);
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

  // Product Actions
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        category: product.category || 'Rakhis',
        subCategory: product.subCategory || (adminCategories[0]?.name || 'Bracelet & Combo Rakhi'),
        price: product.price,
        mrp: product.mrp,
        availableQuantity: product.availableQuantity,
        sku: product.sku,
        badge: product.badge || '',
        images: product.images || ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80'],
        isPersonalized: product.isPersonalized || false,
        customizationLabel: product.customizationLabel || 'Customization Text (7 Chr)',
        customizationMaxChars: product.customizationMaxChars || 7,
        customizationPlaceholder: product.customizationPlaceholder || 'Plz Enter The Text',
        customizationInstruction: product.customizationInstruction || 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)'
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        category: 'Rakhis',
        subCategory: adminCategories[0]?.name || 'Bracelet & Combo Rakhi',
        price: '',
        mrp: '',
        availableQuantity: 50,
        sku: '',
        badge: 'Rakhi Special',
        images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80'],
        isPersonalized: false,
        customizationLabel: 'Customization Text (7 Chr)',
        customizationMaxChars: 7,
        customizationPlaceholder: 'Plz Enter The Text',
        customizationInstruction: 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)'
      });
    }
    setShowProductModal(true);
  };

  const handleAddImageInput = () => {
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImageInput = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleImageInputChange = (index, value) => {
    setProductForm(prev => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const cleanedImages = productForm.images.filter(img => img && img.trim() !== '');
      const payload = {
        ...productForm,
        images: cleanedImages.length > 0 ? cleanedImages : ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80']
      };

      if (editingProduct) {
        await axios.put(`/api/products/admin/${editingProduct._id}`, payload);
      } else {
        await axios.post('/api/products/admin/create', payload);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchAdminProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
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

  // Category Actions
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        parentCategory: cat.parentCategory || 'Rakhis',
        image: cat.image,
        description: cat.description || '',
        displayOrder: cat.displayOrder || 0,
        isActive: cat.isActive !== undefined ? cat.isActive : true
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        parentCategory: 'Rakhis',
        image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80',
        description: '',
        displayOrder: adminCategories.length + 1,
        isActive: true
      });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/admin/${editingCategory._id}`, categoryForm);
      } else {
        await axios.post('/api/categories/admin/create', categoryForm);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      fetchAdminCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/api/categories/admin/${id}`);
      fetchAdminCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // Coupon Actions
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#D4B896]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-[#3A342E] text-[#D4B896] flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Parampara Admin Command Center</h1>
            <p className="text-xs text-[#3A342E]/70">Manage live catalog, Rakhi subcategories, orders, coupons, and festival themes</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center gap-2 shadow-md shrink-0"
        >
          <Download className="w-4 h-4 text-[#D4B896]" /> Export Orders CSV
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#EFE6D8] overflow-x-auto pb-2">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: LayoutDashboard },
          { id: 'categories', label: 'Rakhi Subcategories', icon: Layers },
          { id: 'products', label: 'Catalog Manager', icon: ShoppingBag },
          { id: 'orders', label: 'Order Fulfillment', icon: Package },
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
              className={`px-4 sm:px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
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
        </div>
      )}

      {/* 2. Rakhi Subcategories Tab */}
      {activeTab === 'categories' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D4B896]" /> Rakhi Subcategories Management
              </h2>
              <p className="text-xs text-[#3A342E]/70 mt-1">
                Manage the circular avatar subcategories displayed on the frontend header, homepage, and shop catalog.
              </p>
            </div>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-5 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase font-semibold tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4B896]" /> Add Subcategory
            </button>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="h-36 bg-white/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : adminCategories.length === 0 ? (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-[#EFE6D8]">
              <Layers className="w-8 h-8 text-[#D4B896] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#3A342E]">No subcategories found</p>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="mt-3 px-4 py-2 bg-[#9CAF97] text-white text-xs uppercase rounded-lg font-semibold"
              >
                Create First Subcategory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {adminCategories.map(cat => (
                <div
                  key={cat._id}
                  className="bg-white/80 rounded-2xl p-4 border border-[#EFE6D8] flex items-center gap-3.5 relative group hover:shadow-md transition-all"
                >
                  {/* Circle Thumbnail */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4B896] shrink-0 bg-stone-100">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-serif-display font-semibold text-sm text-[#3A342E] truncate">{cat.name}</h3>
                    <p className="text-[11px] text-[#9CAF97] font-semibold">Order: #{cat.displayOrder || 0}</p>
                    <span className={`inline-block text-[9px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${cat.isActive ? 'bg-[#9CAF97]/20 text-[#9CAF97]' : 'bg-stone-200 text-stone-600'}`}>
                      {cat.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-3 flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="p-1.5 text-[#3A342E]/70 hover:text-[#9CAF97] transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Catalog Manager Tab */}
      {activeTab === 'products' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Live Catalog Management</h2>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-5 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase font-semibold tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#D4B896]" /> Add New Product
            </button>
          </div>

          {loadingProducts ? (
            <div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D4B896]/40 text-[#3A342E]/70 uppercase font-semibold">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Subcategory</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6D8]">
                  {adminProducts.map(prod => (
                    <tr key={prod._id} className="hover:bg-white/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={prod.images?.[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-[#D4B896]/40" />
                        <span className="font-semibold text-[#3A342E] max-w-xs truncate">{prod.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">{prod.sku}</td>
                      <td className="py-3 px-4 font-medium text-[#9CAF97]">{prod.category}</td>
                      <td className="py-3 px-4 font-medium text-[#3A342E]/80">{prod.subCategory || '-'}</td>
                      <td className="py-3 px-4 font-bold text-[#3A342E]">₹{prod.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prod.availableQuantity < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {prod.availableQuantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => handleOpenProductModal(prod)} className="p-1 text-[#3A342E] hover:text-[#9CAF97]">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod._id)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Order Fulfillment Tab */}
      {activeTab === 'orders' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Customer Orders Dispatch</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#3A342E]">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#D4B896]/50 text-xs bg-white focus:outline-none font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loadingOrders ? (
            <div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>
          ) : (
            <div className="space-y-4">
              {adminOrders.map(order => (
                <div key={order._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE6D8] pb-2 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#3A342E]">{order.orderId}</span>
                      <span className="text-[#3A342E]/60 ml-2">• {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#3A342E]">Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-[#D4B896]/50 bg-white font-semibold text-xs"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-[#3A342E]">Shipping Address:</p>
                      <p className="text-[#3A342E]/80">{order.shippingAddress?.fullName} ({order.shippingAddress?.mobile})</p>
                      <p className="text-[#3A342E]/70">{order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-[#3A342E]">Order Items ({order.orderItems?.length}):</p>
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="text-[#3A342E]/80 my-1">
                          <span>{item.qty}x {item.name} (₹{item.price})</span>
                          {item.customText && (
                            <span className="block text-[11px] font-bold text-[#D4B896] bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md mt-0.5">
                              Engrave: "{item.customText}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-right sm:text-left">
                      <p className="font-semibold text-[#3A342E]">Total Paid:</p>
                      <p className="font-serif-display text-lg font-bold text-[#3A342E]">₹{order.pricing?.total}</p>
                      <p className="text-[10px] text-[#9CAF97] font-bold uppercase">{order.paymentMethod} • {order.paymentDetails?.status || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Discount Coupons Engine</h2>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-5 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase font-semibold tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center gap-2 shadow-sm"
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

      {/* 6. Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#D4B896]/40 space-y-6">
          <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Customer Review Moderation</h2>
          <div className="space-y-3">
            {adminReviews.map(rev => (
              <div key={rev._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#3A342E]">{rev.userName} ({rev.rating}★)</span>
                  <span className="text-[#3A342E]/60">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[#3A342E]/80">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Multi-Festival Engine Tab */}
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

      {/* Category Modal (Add / Edit Subcategory) */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCategoryModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-md glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4">
            <h3 className="font-serif-display text-xl font-semibold text-[#3A342E]">
              {editingCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Subcategory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bracelet & Combo Rakhi"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Circle Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Parent Category</label>
                  <select
                    value={categoryForm.parentCategory}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parentCategory: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white font-semibold"
                  >
                    <option value="Rakhis">Rakhis</option>
                    <option value="Sweets">Sweets</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of this subcategory..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#9CAF97]"
                />
                <label htmlFor="isActiveCat" className="font-semibold text-[#3A342E]">Active (Show on Frontend)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 uppercase font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#3A342E] text-white uppercase font-semibold rounded-lg">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowProductModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4 max-h-[90vh] overflow-y-auto">
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
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white font-semibold"
                  >
                    <option value="Rakhis">Rakhis</option>
                    <option value="Sweets">Sweets</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Subcategory</label>
                  <select
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white font-semibold"
                  >
                    <option value="">None / Default</option>
                    {adminCategories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Available Quantity</label>
                  <input
                    type="number"
                    required
                    value={productForm.availableQuantity}
                    onChange={(e) => setProductForm({ ...productForm, availableQuantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>

              {/* Product Images Section */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#D4B896]/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#3A342E] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4B896]" /> Product Images (URL Section) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImageInput}
                    className="text-[11px] font-semibold text-[#9CAF97] hover:text-[#3A342E] flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-[#D4B896]/40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Image URL
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D4B896]/50 bg-stone-100 shrink-0 flex items-center justify-center">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-stone-400" />
                        )}
                      </div>

                      <input
                        type="text"
                        required={idx === 0}
                        placeholder={`Image URL #${idx + 1} (https://...)`}
                        value={imgUrl}
                        onChange={(e) => handleImageInputChange(idx, e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#D4B896]/50 bg-white font-mono text-[11px]"
                      />

                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageInput(idx)}
                          className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                          title="Remove Image URL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalization Options */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPersonalizedCheck"
                    checked={productForm.isPersonalized || false}
                    onChange={(e) => setProductForm({ ...productForm, isPersonalized: e.target.checked })}
                    className="w-4 h-4 rounded text-[#9CAF97]"
                  />
                  <label htmlFor="isPersonalizedCheck" className="font-bold text-[#3A342E]">
                    Enable Text Customization (Personalized Engraved Rakhi)
                  </label>
                </div>

                {productForm.isPersonalized && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold mb-0.5">Label Title</label>
                        <input
                          type="text"
                          value={productForm.customizationLabel}
                          onChange={(e) => setProductForm({ ...productForm, customizationLabel: e.target.value })}
                          className="w-full p-2 rounded border border-[#D4B896]/50 bg-white"
                          placeholder="e.g. Customization Text (7 Chr)"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-0.5">Max Characters</label>
                        <input
                          type="number"
                          value={productForm.customizationMaxChars}
                          onChange={(e) => setProductForm({ ...productForm, customizationMaxChars: Number(e.target.value) })}
                          className="w-full p-2 rounded border border-[#D4B896]/50 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-0.5">Input Placeholder</label>
                      <input
                        type="text"
                        value={productForm.customizationPlaceholder}
                        onChange={(e) => setProductForm({ ...productForm, customizationPlaceholder: e.target.value })}
                        className="w-full p-2 rounded border border-[#D4B896]/50 bg-white"
                        placeholder="e.g. Plz Enter The Text"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-0.5">Helper Instruction Text</label>
                      <input
                        type="text"
                        value={productForm.customizationInstruction}
                        onChange={(e) => setProductForm({ ...productForm, customizationInstruction: e.target.value })}
                        className="w-full p-2 rounded border border-[#D4B896]/50 bg-white"
                        placeholder="e.g. Type in a Word that You Would Like To Be Engraved..."
                      />
                    </div>
                  </div>
                )}
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
