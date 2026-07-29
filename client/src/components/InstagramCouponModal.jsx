import React, { useState } from 'react';
import { X, CheckCircle, Copy, Sparkles } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const InstagramCouponModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { applyCouponCode } = useCart();
  const [loading, setLoading] = useState(false);
  const [claimedCode, setClaimedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOpenInstagram = () => {
    window.open('https://instagram.com', '_blank');
  };

  const handleClaimCoupon = async () => {
    if (!user) {
      setError('Please log in with your mobile number to unlock your 10% coupon code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/coupons/claim-instagram');
      if (res.data.success) {
        setClaimedCode(res.data.code);
        applyCouponCode(res.data.code);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate coupon code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(claimedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-[#3A342E]/50 backdrop-blur-md"></div>

      <div className="relative w-full max-w-md glass-modal rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#D4B896]/50 z-10 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EFE6D8] text-[#3A342E]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4B896] via-[#E8D3CE] to-[#9CAF97] mx-auto flex items-center justify-center text-white mb-4 shadow-md">
          <InstagramIcon className="w-7 h-7" />
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-[#9CAF97] bg-[#9CAF97]/15 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3 h-3 text-[#D4B896]" /> Exclusive Festive Perk
        </span>

        <h3 className="font-serif-display text-2xl font-semibold text-[#3A342E] mb-2">
          Follow Us & Save 10%
        </h3>
        <p className="text-xs text-[#3A342E]/70 mb-6 leading-relaxed">
          Join our Instagram family <strong className="text-[#3A342E]">@paramparaindia</strong> for behind-the-scenes artisan stories, rakhi styling tips, and unlock a 10% discount coupon instantly!
        </p>

        {claimedCode ? (
          <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#D4B896] space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-[#9CAF97] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" /> 10% Coupon Unlocked & Auto-Applied!
            </div>

            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-[#EFE6D8]">
              <span className="font-mono text-base font-bold text-[#3A342E] tracking-widest">{claimedCode}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-[#9CAF97] font-semibold hover:text-[#3A342E]"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-[#3A342E]/60">Valid on your current order. One-time use per customer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleOpenInstagram}
              className="w-full py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-colors flex items-center justify-center gap-2"
            >
              <InstagramIcon className="w-4 h-4 text-[#D4B896]" />
              Follow @paramparaindia on Instagram
            </button>

            <button
              onClick={handleClaimCoupon}
              disabled={loading}
              className="w-full py-3 bg-[#D4B896] text-[#3A342E] text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#9CAF97] hover:text-white transition-colors"
            >
              {loading ? 'Unlocking Coupon...' : "I've Followed — Unlock My Coupon"}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-600 font-medium mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default InstagramCouponModal;
