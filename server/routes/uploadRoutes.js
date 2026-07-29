const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from Environment
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

// Ensure local uploads directory exists as fallback
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage Engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename);
  }
});

// File filter accepting all images
function checkFileType(file, cb) {
  if (file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|bmp|jfif)$/i.test(file.originalname)) {
    return cb(null, true);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Helper: Upload file or path to Cloudinary
const uploadToCloudinary = async (filePathOrBase64, folder = 'parampara_catalog') => {
  if (!isCloudinaryConfigured) return null;
  try {
    const res = await cloudinary.uploader.upload(filePathOrBase64, {
      folder,
      resource_type: 'auto'
    });
    return res.secure_url;
  } catch (err) {
    console.error('Cloudinary upload warning:', err.message || err);
    return null;
  }
};

// Helper middleware for upload single error handling
const uploadSingle = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
    }
    next();
  });
};

// Helper middleware for upload multiple error handling
const uploadMultiple = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Multiple files upload failed' });
    }
    next();
  });
};

// @desc    Upload single image file (Pushes to Cloudinary if available, fallback to local disk)
// @route   POST /api/upload
router.post('/', uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const localPath = req.file.path;
    const fallbackUrl = `/uploads/${req.file.filename}`;

    // Attempt Cloudinary Upload
    let imageUrl = await uploadToCloudinary(localPath);

    if (!imageUrl) {
      imageUrl = fallbackUrl;
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      isCloudinary: imageUrl.includes('cloudinary.com')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload multiple image files
// @route   POST /api/upload/multiple
router.post('/multiple', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const imageUrls = [];
    for (const file of req.files) {
      let url = await uploadToCloudinary(file.path);
      if (!url) url = `/uploads/${file.filename}`;
      imageUrls.push(url);
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload Base64 image string to Cloudinary
// @route   POST /api/upload/base64
router.post('/base64', async (req, res) => {
  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'No base64 image provided' });
    }

    let imageUrl = await uploadToCloudinary(base64Data);

    if (!imageUrl) {
      // Local disk fallback
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.json({ success: true, imageUrl: base64Data });
      }

      const ext = matches[1].split('/')[1] || 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');
      const newFileName = `img-b64-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, newFileName);

      fs.writeFileSync(filePath, buffer);
      imageUrl = `/uploads/${newFileName}`;
    }

    res.json({
      success: true,
      imageUrl,
      isCloudinary: imageUrl.includes('cloudinary.com')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
