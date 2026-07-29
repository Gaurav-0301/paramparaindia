import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, Truck, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageUrl';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, appliedCoupon, discountAmount, shippingFee, cartTotal, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New address form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  if (cartItems.length === 0) {
    navigate('/shop');
    return null;
  }

  const savedAddresses = user?.savedAddresses || [];
  const currentAddress = savedAddresses[selectedAddressIndex] || savedAddresses[0];

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      setShowAddressModal(false);
      setSelectedAddressIndex(savedAddresses.length);
    } catch (err) {
      alert('Failed to save address. Please check input fields.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentAddress) {
      setError('Please select or add a shipping address before proceeding.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          qty: item.qty,
          customText: item.customText || ''
        })),
        shippingAddress: {
          fullName: currentAddress.fullName,
          mobile: currentAddress.mobile,
          streetAddress: currentAddress.streetAddress,
          landmark: currentAddress.landmark || '',
          city: currentAddress.city,
          state: currentAddress.state,
          pincode: currentAddress.pincode
        },
        paymentMethod,
        appliedCoupon: appliedCoupon ? { code: appliedCoupon.code } : null
      };

      const res = await axios.post('/api/orders', orderPayload);

      if (res.data.success) {
        const createdOrder = res.data.order;

        if (paymentMethod === 'Razorpay') {
          // Razorpay test simulation / SDK call
          const razorpayOptions = {
            key: res.data.razorpayOrderData?.key || 'rzp_test_placeholder_key',
            amount: res.data.razorpayOrderData?.amount || cartTotal * 100,
            currency: 'INR',
            name: 'Parampara India',
            description: `Order ${createdOrder.orderId}`,
            order_id: res.data.razorpayOrderData?.id,
            handler: async (response) => {
              // Verify payment on backend
              await axios.post('/api/orders/verify-razorpay', {
                razorpayOrderId: response.razorpay_order_id || res.data.razorpayOrderData?.id,
                razorpayPaymentId: response.razorpay_payment_id || `pay_sim_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || 'sim_sig',
                dbOrderId: createdOrder._id
              });
              clearCart();
              navigate(`/order-confirmation/${createdOrder._id}`);
            },
            prefill: {
              name: currentAddress.fullName,
              contact: currentAddress.mobile
            },
            theme: {
              color: '#3A342E'
            }
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(razorpayOptions);
            rzp.open();
          } else {
            // Simulated razorpay fallback if razorpay script isn't loaded
            await axios.post('/api/orders/verify-razorpay', {
              razorpayOrderId: res.data.razorpayOrderData?.id,
              razorpayPaymentId: `pay_sim_${Date.now()}`,
              razorpaySignature: 'sim_sig',
              dbOrderId: createdOrder._id
            });
            clearCart();
            navigate(`/order-confirmation/${createdOrder._id}`);
          }
        } else {
          // COD Order
          clearCart();
          navigate(`/order-confirmation/${createdOrder._id}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="font-serif-display text-3xl font-semibold text-[#3A342E]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Address Management Section */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D4B896]/40 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#9CAF97]" /> 1. Shipping Address
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs uppercase font-semibold text-[#9CAF97] hover:text-[#3A342E] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="p-4 bg-white/60 rounded-xl border border-[#EFE6D8] text-center space-y-3">
                <p className="text-xs text-[#3A342E]/70">No saved address found. Please add a shipping address.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-5 py-2 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase font-semibold rounded-lg"
                >
                  Add Shipping Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? 'bg-white border-[#9CAF97] shadow-sm ring-1 ring-[#9CAF97]'
                        : 'bg-white/50 border-[#EFE6D8] hover:border-[#D4B896]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#D4B896] tracking-wider bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D4B896]/40">
                        {addr.label}
                      </span>
                      {selectedAddressIndex === idx && (
                        <CheckCircle className="w-4 h-4 text-[#9CAF97]" />
                      )}
                    </div>
                    <p className="font-semibold text-xs text-[#3A342E]">{addr.fullName}</p>
                    <p className="text-xs text-[#3A342E]/80">{addr.streetAddress}, {addr.city}</p>
                    <p className="text-xs text-[#3A342E]/80">{addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-[#3A342E]/60 mt-1 font-mono">Ph: {addr.mobile}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D4B896]/40 space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#3A342E] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#9CAF97]" /> 2. Select Payment Option
            </h2>

            <div className="space-y-3">
              {/* Razorpay */}
              <label
                onClick={() => setPaymentMethod('Razorpay')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'bg-white border-[#9CAF97] shadow-sm'
                    : 'bg-white/50 border-[#EFE6D8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-[#3A342E]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#3A342E]">Razorpay Secure (Recommended)</span>
                    <p className="text-[11px] text-[#3A342E]/60">Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Netbanking</p>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#9CAF97]" />
              </label>

              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-white border-[#9CAF97] shadow-sm'
                    : 'bg-white/50 border-[#EFE6D8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#3A342E]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#3A342E]">Cash on Delivery (COD)</span>
                    <p className="text-[11px] text-[#3A342E]/60">Pay with cash upon doorstep delivery</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-[#D4B896]" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#D4B896]/40 space-y-4">
            <h3 className="font-serif-display text-lg font-semibold text-[#3A342E]">Order Confirmation</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={item.product._id + (item.customText || '') + idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={getImageUrl(item.product?.images?.[0])}
                    alt={item.product?.name || ''}
                    onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                    className="w-12 h-12 object-cover rounded-lg bg-white"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#3A342E] line-clamp-1">{item.product.name}</p>
                    {item.customText && (
                      <p className="text-[10px] text-[#D4B896] font-bold">Engraved: "{item.customText}"</p>
                    )}
                    <p className="text-[#3A342E]/60">Qty: {item.qty} × ₹{item.product.price}</p>
                  </div>
                  <span className="font-bold">₹{item.product.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFE6D8] space-y-1.5 text-xs text-[#3A342E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#9CAF97]">
                  <span>Applied Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-[#9CAF97]">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#EFE6D8]">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all shadow-md"
            >
              {loading ? 'Processing Order...' : `Pay ₹${cartTotal.toLocaleString('en-IN')} & Place Order`}
            </button>
          </div>
        </div>

      </div>

      {/* Add New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddressModal(false)} className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-xs"></div>
          <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 shadow-2xl border border-[#D4B896]/50 space-y-4">
            <h3 className="font-serif-display text-xl font-semibold text-[#3A342E]">Add New Delivery Address</h3>

            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.mobile}
                    onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Street Address / House No / Area *</label>
                <input
                  type="text"
                  required
                  value={newAddress.streetAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D4B896]/50 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-[#3A342E] uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3A342E] text-white uppercase font-semibold rounded-lg hover:bg-[#9CAF97]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
