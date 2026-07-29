const Product = require('../models/Product');

// @desc Get all products with filters & pagination
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, subCategory, search, minPrice, maxPrice, sort, festivalTag, badge, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }
    if (festivalTag) {
      query.festivalTag = festivalTag;
    }
    if (badge) {
      query.badge = badge;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'popular') sortOptions = { numReviews: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const count = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product by ID or Slug
// @route GET /api/products/:identifier
const getProductByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;
    
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    } else {
      product = await Product.findOne({ slug: identifier });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get similar products (Flipkart-style recommendations)
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(6);

    res.status(200).json({
      success: true,
      product,
      similarProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new product (Admin Only)
// @route POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const {
      name, description, category, subCategory, images, price, mrp, availableQuantity, sku, festivalTag, badge, tags,
      isPersonalized, customizationLabel, customizationMaxChars, customizationPlaceholder, customizationInstruction
    } = req.body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = new Product({
      name,
      slug,
      description,
      category,
      subCategory: subCategory || '',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80'],
      price,
      mrp: mrp || price,
      availableQuantity: availableQuantity !== undefined ? availableQuantity : 50,
      sku: sku || `SKU-${Date.now()}`,
      festivalTag: festivalTag || 'Raksha Bandhan',
      badge: badge || '',
      tags: tags || [],
      isPersonalized: isPersonalized !== undefined ? Boolean(isPersonalized) : (subCategory === 'Personalized Rakhi'),
      customizationLabel: customizationLabel || 'Customization Text (7 Chr)',
      customizationMaxChars: customizationMaxChars ? Number(customizationMaxChars) : 7,
      customizationPlaceholder: customizationPlaceholder || 'Plz Enter The Text',
      customizationInstruction: customizationInstruction || 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)'
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product (Admin Only)
// @route PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product (Admin Only)
// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct
};
