import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('parampara_token') || '');
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const fetchCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to fetch user session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const sendOTP = async (mobile) => {
    const res = await axios.post('/api/auth/send-otp', { mobile });
    return res.data;
  };

  const verifyOTP = async (mobile, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { mobile, otp });
    if (res.data.token) {
      localStorage.setItem('parampara_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('parampara_token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (data) => {
    const res = await axios.put('/api/auth/profile', data);
    setUser(res.data.user);
    return res.data;
  };

  const addAddress = async (addressData) => {
    const res = await axios.post('/api/auth/address', addressData);
    setUser(prev => ({ ...prev, savedAddresses: res.data.savedAddresses }));
    return res.data;
  };

  const deleteAddress = async (addressId) => {
    const res = await axios.delete(`/api/auth/address/${addressId}`);
    setUser(prev => ({ ...prev, savedAddresses: res.data.savedAddresses }));
    return res.data;
  };

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    const res = await axios.put(`/api/auth/wishlist/${productId}`);
    setUser(prev => ({ ...prev, wishlist: res.data.wishlist }));
    return true;
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAdmin,
      sendOTP,
      verifyOTP,
      logout,
      updateProfile,
      addAddress,
      deleteAddress,
      toggleWishlist,
      refetchUser: fetchCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
