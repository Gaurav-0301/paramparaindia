import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, Crown } from 'lucide-react';
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
      <div className="bg-[#3A342E] text-[#FAF7F2] text-[10px] sm:text-[11px] font-medium tracking-wider sm:tracking-widest uppercase py-1.5 px-3 text-center flex items-center justify-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4B896] animate-pulse shrink-0"></span>
        <span className="truncate">✨ Raksha Bandhan Campaign Live • Free Doorstep Shipping over ₹499</span>
      </div>

      {/* Sticky Mobile-Perfect Navbar */}
      <header className="sticky top-0 z-40 w-full max-w-full bg-[#FAF7F2] border-b border-[#D4B896]/30 shadow-xs transition-all duration-300 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Controls: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#3A342E] hover:text-[#9CAF97] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2 group py-1">
              <img
                src="/lotus-icon.png"
                alt="Parampara India Lotus Emblem"
                className="h-7 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-serif-display text-base sm:text-2xl font-semibold tracking-wider sm:tracking-widest text-[#3A342E] group-hover:text-[#9CAF97] transition-colors leading-none whitespace-nowrap">
                  PARAMPARA
                </span>
                <span className="hidden xs:block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#D4B896] font-medium mt-0.5 whitespace-nowrap">
                  INDIA • FESTIVE LUXURY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-widest font-medium text-[#3A342E] whitespace-nowrap">
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

          {/* Utility Action Icons (Responsive Layout) */}
          <div className="flex items-center gap-1.5 sm:gap-4 text-[#3A342E] shrink-0">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:text-[#9CAF97] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-[-40px] sm:right-0 top-10 w-[calc(100vw-3rem)] max-w-xs glass-modal p-2 rounded-xl shadow-xl z-50 flex items-center border border-[#D4B896]/50"
                >
                  <input
                    type="text"
                    placeholder="Search Rakhis, Hampers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-transparent focus:outline-none text-[#3A342E]"
                    autoFocus
                  />
                  <button type="submit" className="p-1 text-[#9CAF97] hover:text-[#3A342E]">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/account?tab=wishlist" className="relative p-1.5 hover:text-[#E8D3CE] transition-colors">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8D3CE] text-[#3A342E] text-[8px] sm:text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Admin Badge */}
            {isAdmin && (
              <Link to="/admin" className="hidden md:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9CAF97]/20 text-[#3A342E] border border-[#9CAF97]">
                <Crown className="w-3 h-3 text-[#D4B896]" /> Admin
              </Link>
            )}

            {/* User Account */}
            <Link to={user ? "/account" : "/login"} className="p-1.5 hover:text-[#9CAF97] transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Mini Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 bg-[#3A342E] text-[#FAF7F2] rounded-full hover:bg-[#9CAF97] transition-colors shadow-sm shrink-0"
              aria-label="Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4B896] text-[#3A342E] text-[8px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-[#FAF7F2]">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-modal border-b border-[#D4B896]/30 px-5 py-5 space-y-3.5 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97]"
            >
              Home
            </Link>
            <Link
              to="/shop?category=Rakhis"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97]"
            >
              Rakhis Catalog
            </Link>
            <Link
              to="/shop?category=Sweets"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97]"
            >
              Mithai & Sweets
            </Link>
            <Link
              to="/shop?category=Gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97]"
            >
              Luxury Hampers
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97]"
            >
              All Collections
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs sm:text-sm uppercase tracking-widest font-bold text-[#9CAF97] pt-2 border-t border-[#D4B896]/30"
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
