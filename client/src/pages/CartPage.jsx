import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    couponError,
    couponSuccess,
    applyCouponCode,
    removeCoupon,
    discountAmount,
    shippingFee,
    cartTotal
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axios.get('/api/products?limit=4');
        setRecommendations(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch fallback recommendations:', err);
      }
    };
    fetchRecs();
  }, []);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      await applyCouponCode(inputCoupon.trim());
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#D4B896] mx-auto stroke-1" />
        <h1 className="font-serif-display text-3xl font-semibold text-[#3A342E]">Your Cart is Empty</h1>
        <p className="text-xs text-[#3A342E]/70">Explore our handcrafted Rakhis and luxury hampers to add items to your cart.</p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97]"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <h1 className="font-serif-display text-3xl font-semibold text-[#3A342E]">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="p-4 bg-white/70 rounded-2xl border border-[#EFE6D8] flex gap-4 items-center">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-24 object-cover rounded-xl bg-[#FAF7F2]"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-serif-display font-medium text-base text-[#3A342E]">
                  {item.product.name}
                </h3>
                <p className="text-xs font-semibold text-[#3A342E]">
                  ₹{item.product.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center border border-[#D4B896]/60 rounded-xl bg-white">
                <button
                  onClick={() => updateQuantity(item.product._id, item.qty - 1)}
                  className="px-2.5 py-1 text-xs font-semibold hover:text-[#9CAF97]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.qty + 1)}
                  className="px-2.5 py-1 text-xs font-semibold hover:text-[#9CAF97]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-sm font-semibold text-[#3A342E] w-24 text-right">
                ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
              </span>

              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-[#3A342E]/40 hover:text-red-600 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-[#D4B896]/40 space-y-6 h-fit">
          <h3 className="font-serif-display text-lg font-semibold text-[#3A342E]">Order Summary</h3>

          {/* Coupon */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#9CAF97]/15 border border-[#9CAF97] rounded-xl text-xs">
                <span className="font-semibold text-[#3A342E] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#9CAF97]" />
                  Code: {appliedCoupon.code} (-₹{appliedCoupon.discountAmount})
                </span>
                <button onClick={removeCoupon} className="text-xs text-red-600 font-semibold underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D4B896]/60 bg-white uppercase focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9CAF97] text-white text-xs font-semibold uppercase rounded-xl hover:bg-[#3A342E]"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] text-[#9CAF97] font-semibold mt-1">{couponSuccess}</p>}
          </div>

          <div className="space-y-2 text-xs text-[#3A342E]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#9CAF97]">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? <span className="text-[#9CAF97]">FREE</span> : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-[#EFE6D8]">
              <span>Total Payable</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Fallback Similar Products */}
      {recommendations.length > 0 && (
        <div className="pt-10 border-t border-[#EFE6D8] space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#3A342E]">
            Add Festive Treats To Your Order
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;
