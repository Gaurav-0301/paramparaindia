import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, Award, TrendingUp } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { useFestival } from '../context/FestivalContext';
import CountdownTimer from '../components/CountdownTimer';
import GoldThreadDivider from '../components/GoldThreadDivider';
import ProductCard from '../components/ProductCard';
import RakhiCategoryBar from '../components/RakhiCategoryBar';
import InstagramCouponModal from '../components/InstagramCouponModal';
import { RakhiSticker, BrotherSisterSticker, RakshaBandhanStamp, RakhiStickerBanner } from '../components/FestiveStickers';
import { getImageUrl, DEFAULT_CATEGORY_IMAGE } from '../utils/imageUrl';
import axios from 'axios';

import { useCatalog } from '../context/CatalogContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { festival } = useFestival();
  const { products: catalogProducts, categories: catalogCategories } = useCatalog();
  const [instaModalOpen, setInstaModalOpen] = useState(false);

  const featuredProducts = catalogProducts && catalogProducts.length > 0 ? catalogProducts.slice(0, 6) : [];

  const resolveCategoryImage = (key, fallback) => {
    const found = catalogCategories?.find(c => c.name.toLowerCase().includes(key.toLowerCase()));
    return found?.image ? getImageUrl(found.image, DEFAULT_CATEGORY_IMAGE) : fallback;
  };

  return (
    <div className="min-h-screen space-y-12 sm:space-y-20 lg:space-y-28 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-2 sm:pt-4 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#9CAF97] border border-[#D4B896]/40 max-w-full text-wrap">
                <Sparkles className="w-3 h-3 text-[#D4B896] shrink-0" /> {festival.tagline}
              </span>

              <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#3A342E] leading-tight">
                {festival.heroHeadline}
              </h1>

              <p className="text-xs sm:text-sm text-[#3A342E]/80 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                {festival.heroSubheadline}
              </p>

              {/* Countdown Timer */}
              <div className="pt-1 pb-1 sm:pb-2">
                <p className="text-[10px] uppercase tracking-widest text-[#9CAF97] font-semibold mb-1.5">
                  Campaign Ending In:
                </p>
                <CountdownTimer targetDate={festival.countdownTargetDate} />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  Explore Rakhi Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setInstaModalOpen(true)}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 glass-panel text-[#3A342E] text-xs uppercase tracking-widest font-semibold rounded-xl hover:border-[#D4B896] transition-all flex items-center justify-center gap-2"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#D4B896] shrink-0" />
                  Unlock 10% Instagram Code
                </button>
              </div>

              {/* Real-time Order Ticker */}
              <div className="pt-1 sm:pt-2 flex items-center justify-center lg:justify-start gap-1.5 text-[10px] sm:text-xs text-[#3A342E]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF97] animate-ping shrink-0"></span>
                <TrendingUp className="w-3 h-3 text-[#9CAF97] shrink-0" />
                <span><strong className="text-[#3A342E] font-semibold">142+ Rakhi orders</strong> placed in the last 24 hours</span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative pt-2 sm:pt-4">
              {/* Floating Rakhi Sticker top left */}
              <div className="absolute -top-1 -left-2 sm:-top-3 sm:-left-5 z-30 pointer-events-none">
                <RakhiSticker className="w-16 h-16 sm:w-22 sm:h-22" />
              </div>

              {/* Floating Raksha Bandhan Stamp top right */}
              <div className="absolute top-0 -right-2 sm:-top-2 sm:-right-3 z-30 pointer-events-none">
                <RakshaBandhanStamp className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>

              <div className="relative aspect-[4/3] sm:aspect-[4/4.5] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-3 border-[#FAF7F2] max-h-[380px] sm:max-h-[420px] mx-auto w-full max-w-md lg:max-w-none">
                <img
                  src={festival.bannerImage}
                  alt={festival.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A342E]/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3 glass-panel rounded-lg sm:rounded-xl border border-[#D4B896]/50 text-center">
                  <p className="font-serif-display text-[11px] sm:text-xs italic text-[#3A342E]">
                    "Every thread is woven with love, prayer, and Indian heritage."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Festive Thread Banner with Rakhi & Brother Sister Stickers */}
      <div className="px-4">
        <RakhiStickerBanner />
      </div>

      {/* 2. Gold Thread Motif Divider */}
      <GoldThreadDivider />

      {/* 3. Story of the Festival Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="glass-panel p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-[#D4B896]/40 shadow-sm relative overflow-hidden">
          
          {/* Decorative Brother-Sister Sticker Badge top right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 hidden sm:block">
            <BrotherSisterSticker className="w-24 h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            
            <div className="md:col-span-5 aspect-[16/9] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden max-h-[320px] sm:max-h-none">
              <img
                src={festival.storyImage}
                alt="Story Illustration"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">
                Heritage & Sentiment
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#3A342E]">
                {festival.storyTitle}
              </h2>
              <div className="w-16 h-0.5 bg-[#D4B896]"></div>
              <p className="text-xs sm:text-sm text-[#3A342E]/80 leading-relaxed font-normal pt-1 sm:pt-2">
                {festival.storyNarrative}
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#3A342E]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4B896] shrink-0" />
                  <span>Artisan Handcrafted</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9CAF97] shrink-0" />
                  <span>Pan-India Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5 Circular Rakhi Subcategories Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#D4B896]/40 shadow-xs">
          <RakhiCategoryBar
            onSelectSubCategory={(subCat) => {
              if (subCat) {
                navigate(`/shop?category=Rakhis&subCategory=${encodeURIComponent(subCat)}`);
              } else {
                navigate('/shop?category=Rakhis');
              }
            }}
            title="Browse All Rakhi Subcategories"
          />
        </div>
      </section>

      {/* 4. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 sm:space-y-2 mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">Curated Selections</span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#3A342E]">Shop By Category</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              title: 'Designer Rakhis',
              count: '30+ Designs',
              image: resolveCategoryImage('Designer', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80'),
              link: '/shop?category=Rakhis'
            },
            {
              title: 'Artisanal Mithai',
              count: 'Freshly Prepared',
              image: resolveCategoryImage('Sweets', 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80'),
              link: '/shop?category=Sweets'
            },
            {
              title: 'Luxury Hampers',
              count: 'Complete Combos',
              image: resolveCategoryImage('Combo', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80'),
              link: '/shop?category=Gifts'
            },
            {
              title: '925 Silver Rakhis',
              count: 'Pure Hallmark',
              image: resolveCategoryImage('Golden', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'),
              link: '/shop?category=Rakhis&subCategory=Silver+925'
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-[#EFE6D8]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A342E]/80 via-[#3A342E]/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#D4B896] font-semibold block">{cat.count}</span>
                <h3 className="font-serif-display text-base sm:text-xl font-semibold mt-0.5 leading-snug">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Best Sellers Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">Customer Favorites</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#3A342E]">Trending Rakhi Specials</h2>
          </div>
          <Link to="/shop" className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-[#3A342E] hover:text-[#9CAF97] gold-thread-hover">
            View All Products &rarr;
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 sm:h-80 bg-white/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Instagram Coupon Interactive Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3A342E] text-[#FAF7F2] rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center relative overflow-hidden shadow-lg border border-[#D4B896]/40">
          <div className="max-w-md mx-auto space-y-2">
            <InstagramIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4B896] mx-auto" />
            <h3 className="font-serif-display text-lg sm:text-2xl font-semibold">Unlock 10% Off Your Rakhi Order</h3>
            <p className="text-[11px] sm:text-xs text-[#FAF7F2]/80 leading-relaxed">
              Follow @paramparaindia on Instagram to get access to exclusive single-use festive coupon codes automatically applied at checkout.
            </p>
            <button
              onClick={() => setInstaModalOpen(true)}
              className="mt-2 px-5 py-2.5 bg-[#D4B896] text-[#3A342E] text-[11px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#9CAF97] hover:text-white transition-all shadow-md w-full sm:w-auto"
            >
              Claim 10% Coupon Now
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      <InstagramCouponModal isOpen={instaModalOpen} onClose={() => setInstaModalOpen(false)} />

    </div>
  );
};

export default HomePage;
