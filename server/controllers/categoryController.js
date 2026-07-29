const Category = require('../models/Category');

// @desc Get all categories/subcategories
// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    const { parentCategory, activeOnly } = req.query;
    const query = {};

    if (parentCategory) {
      query.parentCategory = parentCategory;
    }

    if (activeOnly === 'true' || activeOnly === undefined) {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single category by ID or slug
// @route GET /api/categories/:identifier
const getCategoryByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(identifier);
    } else {
      category = await Category.findOne({ slug: identifier });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new category (Admin Only)
// @route POST /api/categories/admin/create
const createCategory = async (req, res) => {
  try {
    const { name, parentCategory, image, description, displayOrder, isActive } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image URL are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    const category = new Category({
      name,
      slug,
      parentCategory: parentCategory || 'Rakhis',
      image,
      description: description || '',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    await category.save();
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update category (Admin Only)
// @route PUT /api/categories/admin/:id
const updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.__v;

    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const oldName = existingCategory.name;

    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (updateData.name && oldName !== updateData.name) {
      const Product = require('../models/Product');
      await Product.updateMany(
        { subCategory: oldName },
        { $set: { subCategory: updateData.name } }
      );
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete category (Admin Only)
// @route DELETE /api/categories/admin/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory
};
