const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { mimeToExt, convertBase64ToUrl } = require('../utils/imageSanitizer');

// Configure Cloudinary
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory Storage accepting 100% of all image types up to 100MB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit to handle raw camera photos & WebP
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Helper: Process image buffer & upload to Cloudinary with 30-second timeout & local fallback
const processImageBuffer = async (buffer, originalname, mimeType = null) => {
  let ext = path.extname(originalname || '').toLowerCase();
  if (!ext || ext === '') {
    ext = mimeToExt(mimeType);
  }
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
  const localFilePath = path.join(uploadDir, filename);

  // Write local file as immediate fallback
  fs.writeFileSync(localFilePath, buffer);
  const localUrl = `/uploads/${filename}`;

  if (!isCloudinaryConfigured) {
    return localUrl;
  }

  try {
    const mime = mimeType || (ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg');
    const base64Data = `data:${mime};base64,${buffer.toString('base64')}`;

    const uploadOptions = {
      folder: 'parampara_catalog',
      resource_type: 'auto'
    };

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      uploadOptions.transformation = [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }];
    }

    const result = await Promise.race([
      cloudinary.uploader.upload(base64Data, uploadOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Cloudinary upload timeout (>30s)')), 30000))
    ]);

    if (result && result.secure_url) {
      console.log('✔ Successfully uploaded image to Cloudinary CDN:', result.secure_url);
      return result.secure_url;
    }
    return localUrl;
  } catch (err) {
    console.warn('⚠️ Cloudinary Upload Error (falling back to local URL):', err.message || err);
    return localUrl;
  }
};

// @desc    Upload single image (Supports WebP, PNG, JPG, GIF, SVG, AVIF, HEIC)
// @route   POST /api/upload
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload limit error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageUrl = await processImageBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
    res.json({
      success: true,
      message: 'Image processed successfully',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
router.post('/multiple', (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload limit error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const url = await processImageBuffer(file.buffer, file.originalname, file.mimetype);
      imageUrls.push(url);
    }

    res.json({
      success: true,
      message: 'Images processed successfully',
      imageUrls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload Base64 image payload (Supports WebP data URLs)
// @route   POST /api/upload/base64
router.post('/base64', async (req, res) => {
  try {
    const { base64Data, image } = req.body;
    const input = base64Data || image;
    if (!input) {
      return res.status(400).json({ success: false, message: 'No base64 data provided' });
    }

    const imageUrl = convertBase64ToUrl(input);

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
