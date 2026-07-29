const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

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

// Helper: Map MIME type to extension
const mimeToExt = (mimeType) => {
  if (!mimeType) return '.jpg';
  const lower = mimeType.toLowerCase();
  if (lower.includes('webp')) return '.webp';
  if (lower.includes('png')) return '.png';
  if (lower.includes('jpeg') || lower.includes('jpg')) return '.jpg';
  if (lower.includes('gif')) return '.gif';
  if (lower.includes('svg')) return '.svg';
  if (lower.includes('avif')) return '.avif';
  if (lower.includes('heic') || lower.includes('heif')) return '.heic';
  if (lower.includes('bmp')) return '.bmp';
  if (lower.includes('tiff')) return '.tiff';
  return '.jpg';
};

// Memory Storage for zero disk-lag uploads accepting all image types
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to handle high-res images
  fileFilter: (req, file, cb) => {
    cb(null, true); // Allow 100% of all image formats (WebP, PNG, JPG, GIF, SVG, AVIF, HEIC, etc.)
  }
});

// Helper: Stream buffer to Cloudinary with auto compression & local fallback
const processImageBuffer = async (buffer, originalname, mimeType = null) => {
  let ext = path.extname(originalname || '').toLowerCase();
  if (!ext || ext === '') {
    ext = mimeToExt(mimeType);
  }
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
  const localFilePath = path.join(uploadDir, filename);

  // Always write local file as instant fallback
  fs.writeFileSync(localFilePath, buffer);
  const localUrl = `/uploads/${filename}`;

  if (!isCloudinaryConfigured) {
    return localUrl;
  }

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'parampara_catalog',
        resource_type: 'auto',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error || !result) {
          console.warn('Cloudinary upload warning (using local fallback):', error?.message || error);
          return resolve(localUrl);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Upload single image (Supports WebP, PNG, JPG, GIF, SVG, AVIF, HEIC)
// @route   POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
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
router.post('/multiple', upload.array('images', 10), async (req, res) => {
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
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'No base64 data provided' });
    }

    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/i);
    if (!matches || matches.length !== 3) {
      return res.json({ success: true, imageUrl: base64Data });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeToExt(mimeType);
    const imageUrl = await processImageBuffer(buffer, `upload${ext}`, mimeType);

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
