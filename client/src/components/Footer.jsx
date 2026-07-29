import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Lock, Heart, Phone, Mail, MapPin } from 'lucide-react';
import GoldThreadDivider from './GoldThreadDivider';

const Footer = () => {
  return (
    <footer className="bg-[#3A342E] text-[#FAF7F2] pt-16 pb-12 mt-20 border-t border-[#D4B896]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#FAF7F2]/10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4B896] mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif-display text-sm font-semibold text-[#FAF7F2]">Express Shipping</h4>
            <p className="text-xs text-[#FAF7F2]/60 mt-1">Doorstep delivery across all Indian pincodes</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4B896] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif-display text-sm font-semibold text-[#FAF7F2]">Razorpay Secure</h4>
            <p className="text-xs text-[#FAF7F2]/60 mt-1">UPI, Cards, Netbanking & COD Supported</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4B896] mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif-display text-sm font-semibold text-[#FAF7F2]">Authentic Craft</h4>
            <p className="text-xs text-[#FAF7F2]/60 mt-1">100% handcrafted by Indian artisans</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4B896] mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-serif-display text-sm font-semibold text-[#FAF7F2]">Easy Replacement</h4>
            <p className="text-xs text-[#FAF7F2]/60 mt-1">Hassle-free return & replacement policy</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif-display text-2xl font-semibold text-[#FAF7F2] tracking-wider">
              PARAMPARA
            </h3>
            <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
              Celebrating India's rich cultural heritage through soft-luxury handcrafted Rakhis, artisanal mithai, and timeless keepsake hampers.
            </p>
            <p className="text-xs text-[#D4B896]">domain: paramparaindia.shop</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4B896] mb-4">
              Festive Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]/80">
              <li><Link to="/shop?category=Rakhis" className="hover:text-[#D4B896] transition-colors">Raksha Bandhan Rakhis</Link></li>
              <li><Link to="/shop?category=Sweets" className="hover:text-[#D4B896] transition-colors">Artisanal Mithai Boxes</Link></li>
              <li><Link to="/shop?category=Gifts" className="hover:text-[#D4B896] transition-colors">Bhaiya Bhabhi Hampers</Link></li>
              <li><Link to="/shop?category=Rakhis&subCategory=Silver+925" className="hover:text-[#D4B896] transition-colors">925 Sterling Silver Rakhis</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4B896] mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]/80">
              <li><Link to="/privacy-policy" className="hover:text-[#D4B896] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-[#D4B896] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#D4B896] transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#D4B896] transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4B896] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4B896] mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3 text-xs text-[#FAF7F2]/80">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4B896]" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4B896]" /> support@paramparaindia.shop
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4B896] shrink-0 mt-0.5" /> Parampara Crafts, Johari Bazaar, Jaipur, Rajasthan 302003
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FAF7F2]/10 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/50 gap-4">
          <p>© 2026 Parampara India (paramparaindia.shop). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-[#FAF7F2]/10 px-2 py-1 rounded text-[10px] text-[#D4B896]">Razorpay Verified</span>
            <span className="bg-[#FAF7F2]/10 px-2 py-1 rounded text-[10px] text-[#D4B896]">GST Invoice Ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
