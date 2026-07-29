import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import GoldThreadDivider from '../components/GoldThreadDivider';
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

  const handleBuyNow = () => {
    addToCart(product, quantity);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Product Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#EFE6D8] shadow-sm relative">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#3A342E] text-xs font-semibold uppercase px-3 py-1 rounded-full border border-[#D4B896]">
                {product.badge}
              </span>
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
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">
              {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#3A342E] mt-1">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-[#D4B896]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#D4B896]' : 'text-[#EFE6D8]'}`} />
                ))}
              </div>
              <span className="font-bold text-[#3A342E]">{product.rating}</span>
              <span className="text-[#3A342E]/50">({product.numReviews} Verified Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 glass-panel rounded-2xl border border-[#D4B896]/30">
            <span className="text-3xl font-semibold text-[#3A342E]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-[#3A342E]/40 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#9CAF97] uppercase tracking-wider bg-[#9CAF97]/15 px-2.5 py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#3A342E]/80 leading-relaxed font-normal">
            {product.description}
          </p>

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
                onClick={() => addToCart(product, quantity)}
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

      {/* Flipkart-Style "Similar Products" / "You May Also Like" Carousel */}
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

      {/* Customer Reviews & Ratings Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">Verified Feedback</span>
            <h2 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Customer Reviews</h2>
          </div>
        </div>

        {/* Leave a review form */}
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
