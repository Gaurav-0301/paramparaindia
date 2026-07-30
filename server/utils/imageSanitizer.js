const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

const convertBase64ToUrl = (base64Str) => {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;
  if (!base64Str.startsWith('data:')) return base64Str;

  try {
    const matches = base64Str.match(/^data:([^;]+);base64,(.+)$/i);
    if (!matches || matches.length !== 3) return base64Str;

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeToExt(mimeType);
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
    const localFilePath = path.join(uploadDir, filename);

    fs.writeFileSync(localFilePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Base64 auto-sanitizer error:', err);
    return base64Str;
  }
};

const sanitizeImages = (imgOrArray) => {
  if (!imgOrArray) return imgOrArray;
  if (Array.isArray(imgOrArray)) {
    return imgOrArray.map(item => convertBase64ToUrl(item));
  }
  return convertBase64ToUrl(imgOrArray);
};

module.exports = {
  convertBase64ToUrl,
  sanitizeImages,
  mimeToExt
};