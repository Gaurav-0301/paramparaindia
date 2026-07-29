import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FestivalProvider } from './context/FestivalContext';
import { CatalogProvider } from './context/CatalogContext';

import WebsitePreloader from './components/WebsitePreloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniCartDrawer from './components/MiniCartDrawer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import {
  PrivacyPolicyPage,
  TermsConditionsPage,
  ShippingPolicyPage,
  RefundPolicyPage,
  ContactUsPage
} from './pages/LegalPages';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <AuthProvider>
      <CartProvider>
        <CatalogProvider>
          <FestivalProvider>
            {showPreloader && <WebsitePreloader onComplete={() => setShowPreloader(false)} />}

            <Router>
              <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3A342E]">
                <Navbar />
                <MiniCartDrawer />
                
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:identifier" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                    
                    <Route path="/admin/*" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                    <Route path="/refund-policy" element={<RefundPolicyPage />} />
                    <Route path="/contact" element={<ContactUsPage />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </Router>
          </FestivalProvider>
        </CatalogProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
