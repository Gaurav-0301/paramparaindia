// Utility for smooth image URL resolution with automatic fallback image
export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80';

export const getImageUrl = (url, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:image/')) {
    return cleanUrl;
  }

  // Get base API URL from environment variable or fallback to localhost server
  const rawApiUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : '';
  
  let baseURL = '';
  if (rawApiUrl) {
    baseURL = rawApiUrl.replace(/\/api\/?$/, '');
  } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    baseURL = 'http://localhost:5000';
  }

  if (cleanUrl.startsWith('/uploads/')) {
    return baseURL ? `${baseURL}${cleanUrl}` : cleanUrl;
  }
  if (cleanUrl.startsWith('uploads/')) {
    return baseURL ? `${baseURL}/${cleanUrl}` : `/${cleanUrl}`;
  }
  return cleanUrl;
};

