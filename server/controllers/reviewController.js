const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc Add a review for product
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = new Review({
      product: productId,
      user: req.user._id,
      userName: req.user.name || 'Verified Buyer',
      rating: Number(rating),
      comment,
      images: images || [],
      verifiedPurchase: true,
      isApproved: true // Auto-approve or moderate
    });

    await review.save();

    // Recalculate product rating & numReviews
    const reviews = await Review.find({ product: productId, isApproved: true });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((totalRating / reviews.length).toFixed(1));
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get reviews for a product
// @route GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin Moderation: get all reviews / delete review
// @route GET /api/reviews/admin/all
const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product', 'name images').sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getAdminReviews,
  deleteReview
};
