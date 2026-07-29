import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Package, Heart, LogOut, Plus, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const AccountPage = () => {
  const { user, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/api/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      setProfileSuccess('Profile details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddr);
      setShowAddressModal(false);
      setNewAddr({ label: 'Home', fullName: user?.name || '', mobile: user?.mobile || '', streetAddress: '', landmark: '', city: '', state: '', pincode: '', isDefault: false });
    } catch (err) {
      alert('Failed to add address.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.put(`/api/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
      fetchMyOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-[#D4B896]/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#3A342E] text-[#FAF7F2] flex items-center justify-center font-serif-display text-xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-serif-display text-2xl font-semibold text-[#3A342E]">{user?.name}</h1>
            <p className="text-xs text-[#3A342E]/70 flex items-center gap-1">
              <span>+91 {user?.mobile}</span>
              <span className="text-[10px] text-[#9CAF97] bg-[#9CAF97]/15 px-2 py-0.5 rounded-full font-bold">Verified</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 w-fit"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`w-full p-3.5 rounded-2xl text-xs uppercase tracking-wider font-semibold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#3A342E] text-[#FAF7F2] shadow-md'
                    : 'glass-panel text-[#3A342E] hover:border-[#D4B896]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-9">
          
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Personal Profile</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D4B896]/60 bg-white text-[#3A342E] font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Mobile Number (Verified)</label>
                  <input
                    type="text"
                    value={`+91 ${user?.mobile}`}
                    disabled
                    className="w-full p-3 rounded-xl border border-[#EFE6D8] bg-[#FAF7F2] text-[#3A342E]/60 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address (Optional for Invoice)</label>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D4B896]/60 bg-white text-[#3A342E] font-medium focus:outline-none"
                  />
                </div>

                {profileSuccess && <p className="text-xs font-semibold text-[#9CAF97]">{profileSuccess}</p>}

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97]"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* 2. Address Book Tab */}
          {activeTab === 'addresses' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-[#9CAF97] text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              {user?.savedAddresses?.length === 0 ? (
                <p className="text-xs text-[#3A342E]/60 italic">No saved addresses yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.savedAddresses?.map((addr) => (
                    <div key={addr._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#D4B896] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D4B896]/40">
                          {addr.label}
                        </span>
                        <button
                          onClick={() => deleteAddress(addr._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-xs text-[#3A342E]">{addr.fullName}</p>
                      <p className="text-xs text-[#3A342E]/80">{addr.streetAddress}, {addr.city}</p>
                      <p className="text-xs text-[#3A342E]/80">{addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-[#3A342E]/60 font-mono">Ph: {addr.mobile}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Order History</h2>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map(n => <div key={n} className="h-32 bg-white/50 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-xs text-[#3A342E]/60 italic">You have not placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order._id} className="p-6 bg-white/80 rounded-2xl border border-[#EFE6D8] space-y-4 shadow-xs">
                      
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFE6D8] pb-3 gap-2">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#3A342E]">{order.orderId}</span>
                          <p className="text-[11px] text-[#3A342E]/60">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-[#9CAF97]/20 text-[#3A342E]'
                          }`}>
                            {order.orderStatus}
                          </span>

                          {['Placed', 'Confirmed'].includes(order.orderStatus) && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-xs text-red-600 font-semibold underline"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2]" />
                            <div className="flex-1">
                              <p className="font-semibold text-[#3A342E]">{item.name}</p>
                              <p className="text-[#3A342E]/60">Qty: {item.qty} × ₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Timeline */}
                      <div className="pt-2 border-t border-[#EFE6D8] flex items-center justify-between text-xs">
                        <span className="text-[#3A342E]/70 font-medium">
                          Total Amount: <strong className="text-[#3A342E]">₹{order.pricing.total.toLocaleString('en-IN')}</strong> ({order.paymentMethod})
                        </span>
                        <button
                          onClick={() => navigate(`/order-confirmation/${order._id}`)}
                          className="text-[#9CAF97] font-semibold underline"
                        >
                          View Full Details & Timeline &rarr;
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">My Wishlist</h2>
              
              {!user?.wishlist || user.wishlist.length === 0 ? (
                <p className="text-xs text-[#3A342E]/60 italic">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.wishlist.map((item) => (
                    typeof item === 'object' && <ProductCard key={item._id} product={item} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddressModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4">
            <h3 className="font-serif-display text-xl font-semibold text-[#3A342E]">Add Address</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mobile *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.mobile}
                    onChange={(e) => setNewAddr({ ...newAddr, mobile: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddr.streetAddress}
                  onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-4 py-2 uppercase font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#3A342E] text-white uppercase font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
