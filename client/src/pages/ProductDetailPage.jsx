import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle, MessageSquare, Sparkles, Type } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import GoldThreadDivider from '../components/GoldThreadDivider';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageUrl';
import axios from 'axios';

const ProductDetailPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/${identifier}`);
      setProduct(res.data.product);
      setSimilarProducts(res.data.similarProducts || []);

      if (res.data.product) {
        const revRes = await axios.get(`/api/reviews/product/${res.data.product._id}`);
        setReviews(revRes.data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-10 h-10 border-2 border-[#D4B896] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Product Not Found</h2>
      </div>
    );
  }

  const isPersonalized = product.isPersonalized || product.subCategory === 'Personalized Rakhi' || product.category === 'Personalized Products';
  const isWishlisted = user?.wishlist?.some(item => (typeof item === 'object' ? item._id : item) === product._id);
  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode)) {
      setPincodeStatus({
        serviceable: true,
        message: 'Delivery available! Estimated delivery within 3-4 business days.'
      });
    } else {
      setPincodeStatus({
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  const handleAddToCart = () => {
    if (isPersonalized && !customText.trim()) {
      alert('Please enter your Customization Text to be engraved on the Rakhi!');
      return;
    }
    addToCart(product, quantity, { customText: customText.trim() });
  };

  const handleBuyNow = () => {
    if (isPersonalized && !customText.trim()) {
      alert('Please enter your Customization Text to be engraved on the Rakhi!');
      return;
    }
    addToCart(product, quantity, { customText: customText.trim() });
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review.');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await axios.post('/api/reviews', {
        productId: product._id,
        rating: newRating,
        comment: newComment
      });
      if (res.data.success) {
        setReviewSuccess('Thank you! Your verified review has been published.');
        setNewComment('');
        fetchProductDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 sm:space-y-16">
      
      {/* Breadcrumbs Navigation */}
      <div className="text-xs text-[#3A342E]/70 flex items-center gap-1.5 flex-wrap">
        <span className="hover:text-[#9CAF97] cursor-pointer" onClick={() => navigate('/')}>Home</span>
        <span>›</span>
        <span className="hover:text-[#9CAF97] cursor-pointer" onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </span>
        {product.subCategory && (
          <>
            <span>›</span>
            <span className="hover:text-[#9CAF97] cursor-pointer" onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}&subCategory=${encodeURIComponent(product.subCategory)}`)}>
              {product.subCategory}
            </span>
          </>
        )}
        <span>›</span>
        <span className="font-semibold text-[#3A342E] truncate max-w-xs">{product.name}</span>
      </div>

      {/* Product Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Gallery with Live Personalization Overlay */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#EFE6D8] shadow-sm relative group">
            <img
              src={getImageUrl(product.images[selectedImage] || product.images[0])}
              alt={product.name}
              onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#FAF7F2]/95 backdrop-blur-xs text-[#3A342E] text-xs font-semibold uppercase px-3 py-1 rounded-full border border-[#D4B896] shadow-xs">
                {product.badge}
              </span>
            )}

            {/* LIVE OVERLAY PREVIEW FOR PERSONALIZED RAKHI */}
            {isPersonalized && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="transform -rotate-[35deg] translate-y-2 sm:translate-y-4 bg-gradient-to-r from-[#D4B896] via-[#FAF7F2] to-[#D4B896] text-[#3A342E] border border-[#3A342E]/40 shadow-xl px-4 py-1 sm:px-6 sm:py-1.5 rounded-md font-serif font-bold text-xs sm:text-base tracking-wider uppercase text-center min-w-[100px] max-w-[160px] border-b-2 border-b-[#3A342E]/70">
                  <span className="drop-shadow-xs font-semibold opacity-95">
                    {customText.trim() ? customText.trim() : (product.customizationPlaceholder || 'Your Name')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-[#9CAF97] scale-95' : 'border-[#EFE6D8] opacity-70'
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt=""
                    onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Customization Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">
              {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
            </span>
            <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#3A342E] mt-1 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
              <span className="text-[#3A342E]/60">SKU: <strong className="font-mono text-[#3A342E]">{product.sku}</strong></span>
              <span className="text-[#3A342E]/30">•</span>
              <div className="flex items-center text-[#D4B896]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#D4B896]' : 'text-[#EFE6D8]'}`} />
                ))}
              </div>
              <span className="font-bold text-[#3A342E]">{product.rating}</span>
              <span className="text-[#3A342E]/50">({product.numReviews} Reviews)</span>
            </div>
          </div>

          {/* Free Shipping Highlight Banner (Reference Image 1) */}
          <div className="bg-red-50/90 border border-red-200/90 rounded-2xl p-3.5 flex items-center gap-3 text-red-900 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-red-700 uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-red-600 font-medium">Above ₹599 Across India</p>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3 p-4 glass-panel rounded-2xl border border-[#D4B896]/30">
            <span className="text-3xl font-semibold text-[#3A342E]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-[#3A342E]/40 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#3A342E]/80 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* PERSONALIZATION CUSTOM TEXT INPUT FIELD (Reference Image 1) */}
          {isPersonalized && (
            <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200/90 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#3A342E] uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#D4B896]" />
                  {product.customizationLabel || `Customization Text (${product.customizationMaxChars || 7} Chr)`} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-[#3A342E]/60 font-mono font-semibold">
                  {customText.length}/{product.customizationMaxChars || 7} Chars
                </span>
              </div>

              <input
                type="text"
                required
                placeholder={product.customizationPlaceholder || "Plz Enter The Text"}
                maxLength={product.customizationMaxChars || 7}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-4 py-3 text-xs font-medium rounded-xl border border-[#D4B896] bg-white focus:outline-none focus:ring-2 focus:ring-[#9CAF97] text-[#3A342E] shadow-2xs"
              />

              <p className="text-[11px] text-[#3A342E]/70 leading-normal">
                {product.customizationInstruction || `Type in a Word that You Would Like To Be Engraved onto Your Product (Only ${product.customizationMaxChars || 7} Character)`}
              </p>
            </div>
          )}

          {/* Delivery Timeline Stepper (Reference Image 1) */}
          <div className="p-4 bg-white/80 rounded-2xl border border-[#EFE6D8] space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CAF97]">Estimated Fulfillment Timeline</span>
            <div className="flex items-center justify-between gap-1 text-[11px] text-center pt-1">
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#3A342E] text-white flex items-center justify-center mb-1 shadow-2xs">
                  <ShoppingBag className="w-4 h-4 text-[#D4B896]" />
                </div>
                <span className="font-bold text-[#3A342E]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[10px] text-[#3A342E]/60">Order Today</span>
              </div>

              <span className="text-red-500 font-bold pb-4">➔</span>

              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#9CAF97] text-white flex items-center justify-center mb-1 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#3A342E]">1-2 Days</span>
                <span className="text-[10px] text-[#3A342E]/60">Order Ready</span>
              </div>

              <span className="text-red-500 font-bold pb-4">➔</span>

              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#D4B896] text-[#3A342E] flex items-center justify-center mb-1 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#3A342E]">3-4 Days</span>
                <span className="text-[10px] text-[#3A342E]/60">Delivered</span>
              </div>
            </div>
          </div>

          {/* Stock & Quantity Selector */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#3A342E]">Quantity:</span>
              <div className="flex items-center border border-[#D4B896]/60 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-semibold hover:text-[#9CAF97]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-semibold hover:text-[#9CAF97]"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-[#9CAF97] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9CAF97]"></span>
                In Stock ({product.availableQuantity} available)
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-[#D4B896] text-[#3A342E] text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#9CAF97] hover:text-white transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Buy Now <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className="p-3.5 glass-panel rounded-xl text-[#3A342E] hover:text-[#E8D3CE] transition-colors flex items-center justify-center"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#E8D3CE] text-[#E8D3CE]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-white/60 rounded-2xl border border-[#EFE6D8] space-y-2">
            <label className="block text-xs font-semibold text-[#3A342E] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#9CAF97]" /> Check Delivery Pincode:
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#D4B896]/50 focus:outline-none text-[#3A342E]"
              />
              <button type="submit" className="px-4 py-1.5 bg-[#3A342E] text-white text-xs uppercase font-semibold rounded-lg">
                Check
              </button>
            </form>

            {pincodeStatus && (
              <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${pincodeStatus.serviceable ? 'text-[#9CAF97]' : 'text-red-600'}`}>
                {pincodeStatus.serviceable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {pincodeStatus.message}
              </p>
            )}
          </div>

        </div>
      </div>

      <GoldThreadDivider />

      {/* Recommendations */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">Recommendations</span>
              <h2 className="font-serif-display text-2xl font-semibold text-[#3A342E]">You May Also Like</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(sim => (
              <ProductCard key={sim._id} product={sim} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">Verified Feedback</span>
            <h2 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Customer Reviews</h2>
          </div>
        </div>

        {/* Leave review form */}
        <div className="p-6 glass-panel rounded-2xl border border-[#D4B896]/40 space-y-4">
          <h3 className="font-serif-display text-lg font-semibold text-[#3A342E] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#9CAF97]" /> Share Your Experience
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#3A342E]">Your Rating:</span>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="px-3 py-1 rounded-lg border border-[#D4B896]/50 bg-white font-semibold text-[#3A342E]"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>

            <textarea
              placeholder="Write your review here... How was the craft, delivery, and emotional packaging?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              required
              className="w-full p-3 text-xs rounded-xl border border-[#D4B896]/50 bg-white focus:outline-none text-[#3A342E]"
            ></textarea>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97]"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
            {reviewSuccess && <p className="text-xs font-semibold text-[#9CAF97] mt-2">{reviewSuccess}</p>}
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#3A342E]/60 italic">No reviews yet for this product. Be the first to leave a review!</p>
          ) : (
            reviews.map(rev => (
              <div key={rev._id} className="p-4 bg-white/70 rounded-xl border border-[#EFE6D8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#3A342E] flex items-center gap-1.5">
                    {rev.userName}
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-[#9CAF97] bg-[#9CAF97]/15 px-2 py-0.5 rounded-full font-bold">
                        Verified Purchase
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#3A342E]/40">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-[#D4B896] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D4B896]' : 'text-[#EFE6D8]'}`} />
                  ))}
                </div>
                <p className="text-xs text-[#3A342E]/80">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

      </section>

    </div>
  );
};

export default ProductDetailPage;
