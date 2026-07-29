import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Clock, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-[#3A342E]">
    <h1 className="font-serif-display text-3xl font-semibold">Privacy Policy</h1>
    <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/40 space-y-4 text-xs leading-relaxed">
      <p>At <strong>Parampara India</strong> (domain: <em>paramparaindia.shop</em>), we value the trust you place in us. We collect minimal customer information (mobile number, shipping address, and order history) strictly to fulfill your festival orders and communicate delivery updates via SMS/WhatsApp.</p>
      <h3 className="font-serif-display text-sm font-semibold pt-2">Data Protection & Security</h3>
      <p>We do not store plain-text payment credentials. All payments are processed through Razorpay's PCI-DSS compliant payment gateway. We never sell your personal information to third parties.</p>
    </div>
  </div>
);

export const TermsConditionsPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-[#3A342E]">
    <h1 className="font-serif-display text-3xl font-semibold">Terms & Conditions</h1>
    <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/40 space-y-4 text-xs leading-relaxed">
      <p>Welcome to <strong>paramparaindia.shop</strong>. By accessing our platform and placing an order, you agree to comply with our terms. Products listed are handcrafted by Indian artisans. Available quantity is managed directly by our store administrators.</p>
    </div>
  </div>
);

export const ShippingPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-[#3A342E]">
    <h1 className="font-serif-display text-3xl font-semibold">Shipping & Delivery Policy</h1>
    <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/40 space-y-4 text-xs leading-relaxed">
      <p>We offer pan-India express doorstep delivery across all serviceable PIN codes. Orders over ₹499 qualify for <strong>FREE Express Shipping</strong>. Standard delivery timeframe is 3 to 5 business days from order confirmation.</p>
    </div>
  </div>
);

export const RefundPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-[#3A342E]">
    <h1 className="font-serif-display text-3xl font-semibold">Return & Refund Policy</h1>
    <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/40 space-y-4 text-xs leading-relaxed">
      <p>We inspect every item before dispatch. If you receive a damaged or incorrect Rakhi/gift, please notify our customer support team within 48 hours of delivery for a replacement or full refund credited back to your original payment source within 5-7 business days.</p>
    </div>
  </div>
);

export const ContactUsPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-[#3A342E]">
    <h1 className="font-serif-display text-3xl font-semibold">Contact Us</h1>
    <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/40 space-y-6">
      <p className="text-xs text-[#3A342E]/80">Have questions about your Raksha Bandhan order or bulk gifting? Reach out to our customer care team:</p>
      
      <div className="space-y-4 text-xs font-medium">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#9CAF97]" />
          <span>Customer Helpline: +91 98765 43210 (Mon-Sat, 9:00 AM - 7:00 PM IST)</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-[#9CAF97]" />
          <span>Email Support: support@paramparaindia.shop</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#9CAF97] shrink-0 mt-0.5" />
          <span>Registered Office: Parampara Crafts, Johari Bazaar, Jaipur, Rajasthan 302003, India</span>
        </div>
      </div>
    </div>
  </div>
);
