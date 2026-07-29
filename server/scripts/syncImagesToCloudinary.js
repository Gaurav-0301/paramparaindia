const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Cloudinary Sync...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Product = require('../models/Product');
const Category = require('../models/Category');

const uploadToCloudinary = async (imageUrl, folder = 'parampara_catalog') => {
  if (!imageUrl || imageUrl.includes('res.cloudinary.com')) return imageUrl;

  try {
    let source = imageUrl;

    // Handle relative /uploads/ paths
    if (imageUrl.startsWith('/uploads/')) {
      const relativePath = imageUrl.substring(1); // 'uploads/img-...'
      const localFilePath = path.join(__dirname, '..', relativePath);
      if (fs.existsSync(localFilePath)) {
        source = localFilePath;
      }
    }

    console.log(`Uploading image to Cloudinary: ${source.substring(0, 60)}...`);
    const res = await cloudinary.uploader.upload(source, {
      folder,
      resource_type: 'auto'
    });
    console.log(` -> Uploaded: ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.warn(` -> Failed to upload ${imageUrl.substring(0, 40)} to Cloudinary:`, err.message || err);
    return imageUrl; // Keep original if fail
  }
};

const syncAllImages = async () => {
  await connectDB();

  console.log('Starting Cloudinary Image Sync for all Products & Categories...');

  // 1. Sync Product Images
  const products = await Product.find({});
  console.log(`Found ${products.length} products to check...`);

  for (const prod of products) {
    let updated = false;
    const newImages = [];

    for (const img of prod.images) {
      if (img && !img.includes('res.cloudinary.com')) {
        const cloudUrl = await uploadToCloudinary(img, 'parampara_products');
        if (cloudUrl !== img) {
          newImages.push(cloudUrl);
          updated = true;
        } else {
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }

    if (updated) {
      prod.images = newImages;
      await prod.save();
      console.log(`Updated Product "${prod.name}" with Cloudinary CDN URLs.`);
    }
  }

  // 2. Sync Category Images
  const categories = await Category.find({});
  console.log(`Found ${categories.length} categories to check...`);

  for (const cat of categories) {
    if (cat.image && !cat.image.includes('res.cloudinary.com')) {
      const cloudUrl = await uploadToCloudinary(cat.image, 'parampara_categories');
      if (cloudUrl !== cat.image) {
        cat.image = cloudUrl;
        await cat.save();
        console.log(`Updated Category "${cat.name}" with Cloudinary CDN URL.`);
      }
    }
  }

  console.log('All catalog images successfully synced to Cloudinary CDN!');
  process.exit(0);
};

syncAllImages();
