import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('parampara_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('parampara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.product._id === product._id);
      if (existing) {
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [...prevItems, { product, qty }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const applyCouponCode = async (code) => {
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await axios.post('/api/coupons/validate', {
        code,
        cartSubtotal
      });
      if (res.data.success) {
        setAppliedCoupon({
          code: res.data.code,
          discountAmount: res.data.discountAmount,
          discountType: res.data.discountType,
          discountValue: res.data.discountValue
        });
        setCouponSuccess(res.data.message);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply coupon';
      setCouponError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = cartSubtotal > 499 || cartItems.length === 0 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      appliedCoupon,
      couponError,
      couponSuccess,
      applyCouponCode,
      removeCoupon,
      discountAmount,
      shippingFee,
      cartTotal,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
