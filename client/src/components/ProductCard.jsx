import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();

  const isWishlisted = user?.wishlist?.some(item => (typeof item === 'object' ? item._id : item) === product._id);

  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white/60 rounded-xl overflow-hidden border border-[#EFE6D8] transition-all duration-300 hover:shadow-lg hover:border-[#D4B896]/60">
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#3A342E] text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#D4B896]/50 shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-panel flex items-center justify-center text-[#3A342E] hover:text-[#E8D3CE] transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-[#E8D3CE] text-[#E8D3CE]' : ''}`} />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full py-1.5 sm:py-2.5 bg-[#3A342E] text-[#FAF7F2] text-[10px] sm:text-xs uppercase tracking-widest font-medium rounded-lg shadow-md hover:bg-[#9CAF97] transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow bg-white/40 backdrop-blur-xs">
        <div className="flex items-center gap-1 mb-1 text-[11px] sm:text-xs text-[#9CAF97]">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D4B896] text-[#D4B896]" />
          <span className="font-semibold text-[#3A342E]">{product.rating || 4.8}</span>
          <span className="text-[#3A342E]/50">({product.numReviews || 12})</span>
        </div>

        <Link to={`/product/${product.slug}`} className="group-hover:text-[#9CAF97] transition-colors">
          <h3 className="font-serif-display font-medium text-xs sm:text-base text-[#3A342E] line-clamp-1 mb-0.5 sm:mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[10px] sm:text-xs text-[#3A342E]/70 line-clamp-1 mb-2 sm:mb-3">
          {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
        </p>

        {/* Pricing */}
        <div className="mt-auto flex flex-wrap items-baseline gap-1 sm:gap-2">
          <span className="text-xs sm:text-base font-semibold text-[#3A342E]">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="text-[10px] sm:text-xs text-[#3A342E]/40 line-through">
                ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#9CAF97] tracking-wider uppercase">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
