import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, ShieldCheck, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { setIsCartOpen, totalItemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#3A342E] text-[#FAF7F2] text-[11px] font-medium tracking-widest uppercase py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4B896] animate-pulse"></span>
        ✨ Raksha Bandhan Campaign Live • Free Doorstep Shipping on orders over ₹499
      </div>

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#D4B896]/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#3A342E] hover:text-[#9CAF97]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group py-1">
            <img
              src="/logo.png"
              alt="Parampara India Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-[#3A342E]">
            <Link to="/" className="gold-thread-hover hover:text-[#9CAF97] transition-colors py-1">
              Home
            </Link>
            <Link to="/shop?category=Rakhis" className="gold-thread-hover hover:text-[#9CAF97] transition-colors py-1">
              Rakhis
            </Link>
            <Link to="/shop?category=Sweets" className="gold-thread-hover hover:text-[#9CAF97] transition-colors py-1">
              Mithai
            </Link>
            <Link to="/shop?category=Gifts" className="gold-thread-hover hover:text-[#9CAF97] transition-colors py-1">
              Luxury Hampers
            </Link>
            <Link to="/shop" className="gold-thread-hover hover:text-[#9CAF97] transition-colors py-1">
              All Collections
            </Link>
          </nav>

          {/* Utility Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6 text-[#3A342E]">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:text-[#9CAF97] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-10 w-72 glass-modal p-2 rounded-xl shadow-xl z-50 flex items-center border border-[#D4B896]/50"
                >
                  <input
                    type="text"
                    placeholder="Search Rakhis, Hampers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-transparent focus:outline-none text-[#3A342E]"
                    autoFocus
                  />
                  <button type="submit" className="p-1.5 text-[#9CAF97] hover:text-[#3A342E]">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/account?tab=wishlist" className="relative p-1.5 hover:text-[#E8D3CE] transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E8D3CE] text-[#3A342E] text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Admin Badge */}
            {isAdmin && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#9CAF97]/20 text-[#3A342E] border border-[#9CAF97]">
                <Crown className="w-3 h-3 text-[#D4B896]" /> Admin
              </Link>
            )}

            <Link to={user ? "/account" : "/login"} className="p-1.5 hover:text-[#9CAF97] transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Mini Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-[#3A342E] text-[#FAF7F2] rounded-full hover:bg-[#9CAF97] transition-colors shadow-sm"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4B896] text-[#3A342E] text-[10px] font-bold flex items-center justify-center border-2 border-[#FAF7F2]">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-modal border-b border-[#D4B896]/30 px-6 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-[#3A342E] hover:text-[#9CAF97]"
            >
              Home
            </Link>
            <Link
              to="/shop?category=Rakhis"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-[#3A342E] hover:text-[#9CAF97]"
            >
              Rakhis
            </Link>
            <Link
              to="/shop?category=Sweets"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-[#3A342E] hover:text-[#9CAF97]"
            >
              Mithai & Sweets
            </Link>
            <Link
              to="/shop?category=Gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-[#3A342E] hover:text-[#9CAF97]"
            >
              Luxury Hampers
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-[#3A342E] hover:text-[#9CAF97]"
            >
              All Collections
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-bold text-[#9CAF97]"
              >
                👑 Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
