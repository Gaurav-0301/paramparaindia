import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MiniCartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
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
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);
    await applyCouponCode(inputCoupon.trim());
    setApplying(false);
  };

  const freeShippingThreshold = 499;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#3A342E]/40 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-modal shadow-2xl flex flex-col border-l border-[#D4B896]/30">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#EFE6D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#9CAF97]" />
              <h2 className="font-serif-display text-xl font-semibold text-[#3A342E]">Your Shopping Bag</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#EFE6D8] text-[#3A342E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FAF7F2] p-4 border-b border-[#EFE6D8]">
            <p className="text-xs text-[#3A342E] mb-1.5 font-medium">
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-[#9CAF97] font-semibold">🎉 You unlocked FREE Express Shipping!</span>
              ) : (
                `Add ₹${amountNeededForFreeShipping} more to qualify for FREE Express Shipping`
              )}
            </p>
            <div className="w-full bg-[#EFE6D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#9CAF97] h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#3A342E]/60 py-12">
                <ShoppingBag className="w-12 h-12 stroke-1 text-[#D4B896] mb-3" />
                <p className="font-serif-display text-lg font-medium text-[#3A342E]">Your bag is currently empty</p>
                <p className="text-xs text-[#3A342E]/70 mt-1 mb-6">Discover handcrafted Rakhis and luxury hampers</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-[#9CAF97] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-4 p-3 bg-white/60 rounded-xl border border-[#EFE6D8]">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg bg-[#FAF7F2]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-display text-sm font-medium text-[#3A342E] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#3A342E] mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D4B896]/50 rounded-lg bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.qty - 1)}
                          className="p-1 hover:text-[#9CAF97]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.qty + 1)}
                          className="p-1 hover:text-[#9CAF97]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-[#3A342E]/50 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#EFE6D8] bg-[#FAF7F2]/80 space-y-4">
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#9CAF97]/15 border border-[#9CAF97] rounded-lg text-xs">
                    <span className="font-semibold text-[#3A342E] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#9CAF97]" />
                      Code: {appliedCoupon.code} (-₹{appliedCoupon.discountAmount})
                    </span>
                    <button onClick={removeCoupon} className="text-xs text-red-600 underline font-medium">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#D4B896]/60 bg-white focus:outline-none focus:border-[#9CAF97] text-[#3A342E] uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-[#9CAF97] text-white text-xs uppercase font-medium rounded-lg hover:bg-[#3A342E] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-[#9CAF97] font-medium mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#3A342E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#9CAF97]">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <span className="text-[#9CAF97]">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#3A342E] pt-2 border-t border-[#EFE6D8]">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MiniCartDrawer;
