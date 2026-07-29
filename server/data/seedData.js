const seedProducts = [
  {
    name: 'Champagne Kundan Thread Rakhi',
    slug: 'champagne-kundan-thread-rakhi',
    description: 'An exquisite hand-crafted Rakhi featuring genuine champagne-tinted Kundan work set in anti-tarnish gold plating, finished with ultra-soft organic silk threads. Designed to feel weightless and regal on your brother\'s wrist.',
    category: 'Rakhis',
    subCategory: 'Kundan & Gold',
    images: [
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    price: 499,
    mrp: 999,
    availableQuantity: 45,
    sku: 'RAK-KND-001',
    festivalTag: 'Raksha Bandhan',
    badge: 'Bestseller',
    rating: 4.9,
    numReviews: 28,
    tags: ['Kundan', 'Gold Plated', 'Silk Thread', 'Rakhi Special']
  },
  {
    name: 'Minimalist Sage Meenakari Rakhi',
    slug: 'minimalist-sage-meenakari-rakhi',
    description: 'Subtle elegance meets tradition. Hand-enameled in muted sage green Meenakari artwork on a solid brass base, stringed on fine gold cotton cord.',
    category: 'Rakhis',
    subCategory: 'Meenakari',
    images: [
      'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    price: 399,
    mrp: 799,
    availableQuantity: 60,
    sku: 'RAK-MNK-002',
    festivalTag: 'Raksha Bandhan',
    badge: 'Limited Edition',
    rating: 4.8,
    numReviews: 19,
    tags: ['Meenakari', 'Sage Green', 'Minimalist']
  },
  {
    name: 'Royal Bhaiya-Bhabhi Lumba Set',
    slug: 'royal-bhaiya-bhabhi-lumba-set',
    description: 'A matching pair of handcrafted Rakhi for Brother and elegant hanging Lumba for Bhabhi, embellished with freshwater pearls, glass beads, and gold tassels.',
    category: 'Combos',
    subCategory: 'Bhaiya Bhabhi Set',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    price: 899,
    mrp: 1499,
    availableQuantity: 30,
    sku: 'RAK-CMB-003',
    festivalTag: 'Raksha Bandhan',
    badge: 'Rakhi Special',
    rating: 5.0,
    numReviews: 42,
    tags: ['Lumba', 'Pearl', 'Combo', 'Gift Box']
  },
  {
    name: 'Artisanal Almond & Pistachio Mithai Box',
    slug: 'artisanal-almond-pistachio-mithai-box',
    description: 'Pure saffron-infused dry fruit bites crafted with organic California almonds and Iranian pistachios. Zero refined sugar, 100% natural luxury gifting.',
    category: 'Sweets',
    subCategory: 'Dry Fruit Sweets',
    images: [
      'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
    ],
    price: 749,
    mrp: 1199,
    availableQuantity: 25,
    sku: 'SWT-BOX-004',
    festivalTag: 'Raksha Bandhan',
    badge: 'Freshly Made',
    rating: 4.9,
    numReviews: 31,
    tags: ['Gourmet', 'Mithai', 'Organic', 'Sugar Free']
  },
  {
    name: 'Rose Gold Eternal Sibling Hamper',
    slug: 'rose-gold-eternal-sibling-hamper',
    description: 'The ultimate gesture of affection: Includes 1 Premium Kundan Rakhi, 250g Artisanal Mithai Box, a personalized brass bookmark, and a handwritten note card.',
    category: 'Gifts',
    subCategory: 'Luxury Hampers',
    images: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
    ],
    price: 1299,
    mrp: 2499,
    availableQuantity: 20,
    sku: 'GFT-HMP-005',
    festivalTag: 'Raksha Bandhan',
    badge: 'Premium Gift',
    rating: 5.0,
    numReviews: 54,
    tags: ['Hamper', 'Gift Set', 'Luxury Box']
  },
  {
    name: 'Sterling Silver 925 Om Rakhi Bracelet',
    slug: 'sterling-silver-925-om-rakhi-bracelet',
    description: 'Crafted in hallmarked 925 sterling silver with adjustable leather cord, wearable every day long after the festival concludes as a protective charm.',
    category: 'Rakhis',
    subCategory: 'Silver 925',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    price: 999,
    mrp: 1899,
    availableQuantity: 35,
    sku: 'RAK-SLV-006',
    festivalTag: 'Raksha Bandhan',
    badge: '925 Silver',
    rating: 4.7,
    numReviews: 16,
    tags: ['925 Silver', 'Bracelet', 'Wearable']
  }
];

const seedCoupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 499,
    maxDiscount: 300,
    expiryDate: new Date('2026-12-31'),
    totalUsageLimit: 5000,
    isActive: true
  },
  {
    code: 'RAKHI200',
    discountType: 'flat',
    discountValue: 200,
    minOrderAmount: 999,
    maxDiscount: 200,
    expiryDate: new Date('2026-12-31'),
    totalUsageLimit: 1000,
    isActive: true
  }
];

module.exports = { seedProducts, seedCoupons };
