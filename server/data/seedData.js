const seedCategories = [
  {
    name: 'Bracelet & Combo Rakhi',
    slug: 'bracelet-combo-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80',
    description: 'Stylish wearable bracelet rakhis paired with festive combos.',
    displayOrder: 1
  },
  {
    name: 'Designer & Pearl Rakhi',
    slug: 'designer-pearl-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80',
    description: 'Intricately handcrafted designer rakhis studded with genuine pearls.',
    displayOrder: 2
  },
  {
    name: 'Premium Rakhi',
    slug: 'premium-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    description: 'High-end artisan luxury rakhis crafted with premium embellishments.',
    displayOrder: 3
  },
  {
    name: 'Golden Rakhi',
    slug: 'golden-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=500&auto=format&fit=crop&q=80',
    description: 'Auspicious gold-plated and solid metallic central motif rakhis.',
    displayOrder: 4
  },
  {
    name: 'Flower Design Rakhi',
    slug: 'flower-design-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80',
    description: 'Blooming floral patterns decorated with vibrant silk threads.',
    displayOrder: 5
  },
  {
    name: 'Religious & Devotional Rakhi',
    slug: 'religious-devotional-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&auto=format&fit=crop&q=80',
    description: 'Sacred Ganesha, Krishna, Om and Swastik blessed rakhis.',
    displayOrder: 6
  },
  {
    name: 'Kids & Charm Rakhi',
    slug: 'kids-charm-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&auto=format&fit=crop&q=80',
    description: 'Playful superhero, cartoon, and cute charm rakhis for young ones.',
    displayOrder: 7
  },
  {
    name: 'Peacock & Floral Rakhi',
    slug: 'peacock-floral-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: 'Royal Mayur peacock feathers and meenakari floral motifs.',
    displayOrder: 8
  },
  {
    name: 'Personalized Rakhi',
    slug: 'personalized-rakhi',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80',
    description: 'Custom name-engraved brass and silver rakhis.',
    displayOrder: 9
  },
  {
    name: 'Rakhi Combo',
    slug: 'rakhi-combo',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&auto=format&fit=crop&q=80',
    description: 'Complete festive gift packs featuring Rakhi, Roli Chawal & Sweets.',
    displayOrder: 10
  },
  {
    name: 'Exclusive Rakhi Sets',
    slug: 'exclusive-rakhi-sets',
    parentCategory: 'Rakhis',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    description: 'Sets of 2, 3, or 5 matching thread rakhis for all brothers.',
    displayOrder: 11
  },
  // Sweets Subcategories
  {
    name: 'Assorted Mithai Box',
    slug: 'assorted-mithai-box',
    parentCategory: 'Sweets',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    description: 'Handcrafted traditional Indian sweets prepared with pure desi ghee.',
    displayOrder: 1
  },
  {
    name: 'Kaju Katli & Dry Fruit',
    slug: 'kaju-katli-dry-fruit',
    parentCategory: 'Sweets',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
    description: 'Premium cashew kaju katli silver leaves paired with roasted dry fruits.',
    displayOrder: 2
  },
  {
    name: 'Motichoor & Besan Ladoo',
    slug: 'motichoor-besan-ladoo',
    parentCategory: 'Sweets',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    description: 'Aromatic saffron motichoor and pure ghee besan ladoos.',
    displayOrder: 3
  },
  {
    name: 'Traditional Soan Papdi',
    slug: 'traditional-soan-papdi',
    parentCategory: 'Sweets',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    description: 'Flaky pistachio and cardamom infused traditional soan papdi.',
    displayOrder: 4
  },
  // Gifts Subcategories
  {
    name: 'Luxury Gift Hampers',
    slug: 'luxury-gift-hampers',
    parentCategory: 'Gifts',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&auto=format&fit=crop&q=80',
    description: 'Curated gift hampers featuring personalized items and festive treats.',
    displayOrder: 1
  },
  {
    name: 'Personalized Accessories',
    slug: 'personalized-accessories',
    parentCategory: 'Gifts',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80',
    description: 'Custom name engraved wallets, mugs, keys, and keepsakes.',
    displayOrder: 2
  },
  {
    name: 'Silver & Brass Pooja Coins',
    slug: 'silver-brass-pooja-coins',
    parentCategory: 'Gifts',
    image: 'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=500&auto=format&fit=crop&q=80',
    description: '925 sterling silver and auspicious Lakshmi-Ganesha coins.',
    displayOrder: 3
  },
  // Combos Subcategories
  {
    name: 'Grand Rakhi & Sweets Combo',
    slug: 'grand-rakhi-sweets-combo',
    parentCategory: 'Combos',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80',
    description: 'Complete festive celebration box with Rakhi, Roli Chawal and Sweets.',
    displayOrder: 1
  },
  {
    name: 'Premium Rakhi & Dry Fruits Box',
    slug: 'premium-rakhi-dry-fruits-box',
    parentCategory: 'Combos',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    description: 'Artisan Rakhi presented with roasted almonds, cashews & raisins.',
    displayOrder: 2
  },
  {
    name: 'Family Rakhi & Gift Set',
    slug: 'family-rakhi-gift-set',
    parentCategory: 'Combos',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    description: 'Sets for Bhaiya Bhabhi & kids paired with customized gifts.',
    displayOrder: 3
  }
];

const seedProducts = [
  // 1. Bracelet & Combo Rakhi
  {
    name: 'Royal Engraved Name Plate Bracelet Rakhi',
    slug: 'royal-engraved-name-plate-bracelet-rakhi',
    description: 'Personalized brass bracelet rakhi with customized brother name engraving and rudraksha beads.',
    category: 'Rakhis',
    subCategory: 'Bracelet & Combo Rakhi',
    images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'],
    price: 599,
    mrp: 1199,
    availableQuantity: 50,
    sku: 'RAK-BRC-001',
    festivalTag: 'Raksha Bandhan',
    badge: 'Personalized',
    rating: 4.9,
    numReviews: 34,
    tags: ['Bracelet', 'Personalized', 'Rudraksha'],
    isPersonalized: true
  },
  {
    name: 'Gold Plated Cuff Bracelet & Roli Combo Rakhi',
    slug: 'gold-plated-cuff-bracelet-roli-combo-rakhi',
    description: 'Adjustable anti-tarnish gold cuff bracelet Rakhi stringed with rudraksha and chandan beads combo.',
    category: 'Rakhis',
    subCategory: 'Bracelet & Combo Rakhi',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
    price: 649,
    mrp: 1299,
    availableQuantity: 40,
    sku: 'RAK-BRC-002',
    festivalTag: 'Raksha Bandhan',
    badge: 'Combo Special',
    rating: 4.8,
    numReviews: 19,
    tags: ['Bracelet', 'Gold Plated']
  },

  // 2. Designer & Pearl Rakhi
  {
    name: 'Champagne Kundan Thread Rakhi',
    slug: 'champagne-kundan-thread-rakhi',
    description: 'An exquisite hand-crafted Rakhi featuring genuine champagne-tinted Kundan work set in anti-tarnish gold plating, finished with ultra-soft organic silk threads.',
    category: 'Rakhis',
    subCategory: 'Designer & Pearl Rakhi',
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
    tags: ['Kundan', 'Gold Plated', 'Pearl', 'Silk Thread']
  },
  {
    name: 'Freshwater Pearl & Zircon Designer Rakhi',
    slug: 'freshwater-pearl-zircon-designer-rakhi',
    description: 'Pure freshwater pearl cluster centerpiece with American diamond zircons stringed on crimson thread.',
    category: 'Rakhis',
    subCategory: 'Designer & Pearl Rakhi',
    images: ['https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=800&auto=format&fit=crop&q=80'],
    price: 549,
    mrp: 1099,
    availableQuantity: 30,
    sku: 'RAK-PRL-002',
    festivalTag: 'Raksha Bandhan',
    badge: 'Pearl Luxury',
    rating: 5.0,
    numReviews: 24,
    tags: ['Pearl', 'Designer', 'Zircon']
  },

  // 3. Premium Rakhi
  {
    name: 'Heritage Royal Antique Gold Kundan Premium Rakhi',
    slug: 'heritage-royal-antique-gold-kundan-premium-rakhi',
    description: 'Heritage artisan masterpiece with gold leafing, ruby colored stones, and organic zari thread cord.',
    category: 'Rakhis',
    subCategory: 'Premium Rakhi',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
    price: 799,
    mrp: 1499,
    availableQuantity: 25,
    sku: 'RAK-PRM-001',
    festivalTag: 'Raksha Bandhan',
    badge: 'Luxury Edition',
    rating: 5.0,
    numReviews: 38,
    tags: ['Premium', 'Kundan', 'Royal']
  },

  // 4. Golden Rakhi
  {
    name: 'Minimalist Sage Meenakari Golden Rakhi',
    slug: 'minimalist-sage-meenakari-golden-rakhi',
    description: 'Subtle elegance meets tradition. Hand-enameled in muted sage green Meenakari artwork on a solid brass base.',
    category: 'Rakhis',
    subCategory: 'Golden Rakhi',
    images: ['https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=800&auto=format&fit=crop&q=80'],
    price: 399,
    mrp: 799,
    availableQuantity: 60,
    sku: 'RAK-GLD-088',
    festivalTag: 'Raksha Bandhan',
    badge: 'Golden Special',
    rating: 4.8,
    numReviews: 19,
    tags: ['Golden', 'Meenakari', 'Sage Green']
  },

  // 5. Flower Design Rakhi
  {
    name: 'Blooming Lotus & Zardosi Flower Rakhi',
    slug: 'blooming-lotus-zardosi-flower-rakhi',
    description: 'Intricate zardosi embroidered lotus floral central charm stringed on pure resham thread.',
    category: 'Rakhis',
    subCategory: 'Flower Design Rakhi',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
    price: 449,
    mrp: 899,
    availableQuantity: 40,
    sku: 'RAK-FLR-003',
    festivalTag: 'Raksha Bandhan',
    badge: 'Floral Special',
    rating: 4.9,
    numReviews: 22,
    tags: ['Flower Design', 'Zardosi', 'Lotus']
  },

  // 6. Religious & Devotional Rakhi
  {
    name: 'Bal Krishna & Lord Ganesha Devotional Rakhi',
    slug: 'bal-krishna-lord-ganesha-devotional-rakhi',
    description: 'Sacred divine charm featuring miniature Bal Krishna figure with pastel beads and chandan fragrance.',
    category: 'Rakhis',
    subCategory: 'Religious & Devotional Rakhi',
    images: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80'],
    price: 499,
    mrp: 999,
    availableQuantity: 35,
    sku: 'RAK-DEV-004',
    festivalTag: 'Raksha Bandhan',
    badge: 'Sacred Charm',
    rating: 5.0,
    numReviews: 45,
    tags: ['Religious', 'Devotional', 'Krishna', 'Ganesha']
  },

  // 7. Kids & Charm Rakhi
  {
    name: 'Cute Cartoon & Superhero Kids Rakhi',
    slug: 'cute-cartoon-superhero-kids-rakhi',
    description: 'Soft silicone non-toxic charm rakhi for little brothers with vibrant adjustable band.',
    category: 'Rakhis',
    subCategory: 'Kids & Charm Rakhi',
    images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80'],
    price: 299,
    mrp: 599,
    availableQuantity: 70,
    sku: 'RAK-KID-005',
    festivalTag: 'Raksha Bandhan',
    badge: 'Kids Choice',
    rating: 4.8,
    numReviews: 18,
    tags: ['Kids', 'Charm', 'Soft']
  },

  // 8. Peacock & Floral Rakhi
  {
    name: 'Royal Peacock Feather Meenakari Rakhi',
    slug: 'royal-peacock-feather-meenakari-rakhi',
    description: 'Handcrafted Mayur peacock centerpiece with multi-colored floral beads and golden tassel cord.',
    category: 'Rakhis',
    subCategory: 'Peacock & Floral Rakhi',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'],
    price: 479,
    mrp: 899,
    availableQuantity: 50,
    sku: 'RAK-PCK-006',
    festivalTag: 'Raksha Bandhan',
    badge: 'Artisan Pick',
    rating: 4.9,
    numReviews: 29,
    tags: ['Peacock', 'Floral', 'Meenakari']
  },

  // 9. Personalized Rakhi
  {
    name: 'Personalized Rudraksha Rakhi – Custom Name Plate For Brother',
    slug: 'personalized-rudraksha-rakhi-custom-name-plate-for-brother',
    description: 'Customized metallic name plate rakhi featuring genuine rudraksha beads, pearl accents, and a soft crimson thread cord.',
    category: 'Rakhis',
    subCategory: 'Personalized Rakhi',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80'
    ],
    price: 499,
    mrp: 999,
    availableQuantity: 100,
    sku: 'RAK-PRZ-964',
    festivalTag: 'Raksha Bandhan',
    badge: 'Bestseller',
    rating: 4.9,
    numReviews: 64,
    tags: ['Personalized', 'Rudraksha', 'Custom Name', 'Name Plate'],
    isPersonalized: true,
    customizationLabel: 'Customization Text (7 Chr)',
    customizationMaxChars: 7,
    customizationPlaceholder: 'Plz Enter The Text',
    customizationInstruction: 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)'
  },
  {
    name: 'Custom Monogram Stainless Steel Rakhi',
    slug: 'custom-monogram-stainless-steel-rakhi',
    description: 'Personalized laser-etched initial monogram rakhi stringed on premium silk cord.',
    category: 'Rakhis',
    subCategory: 'Personalized Rakhi',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'],
    price: 549,
    mrp: 999,
    availableQuantity: 40,
    sku: 'RAK-PRZ-007',
    festivalTag: 'Raksha Bandhan',
    badge: 'Custom Made',
    rating: 4.9,
    numReviews: 31,
    tags: ['Personalized', 'Monogram', 'Custom'],
    isPersonalized: true,
    customizationLabel: 'Customization Text (7 Chr)',
    customizationMaxChars: 7,
    customizationPlaceholder: 'Plz Enter The Text',
    customizationInstruction: 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)'
  },

  // 10. Rakhi Combo
  {
    name: 'Parampara Grand Rakhi Sweets & Roli Combo',
    slug: 'parampara-grand-rakhi-sweets-roli-combo',
    description: 'Complete celebration hamper containing 1 Premium Kundan Rakhi, Kaju Katli Box, organic Roli-Chawal thali, and greeting card.',
    category: 'Rakhis',
    subCategory: 'Rakhi Combo',
    images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80'],
    price: 999,
    mrp: 1799,
    availableQuantity: 30,
    sku: 'RAK-CMB-008',
    festivalTag: 'Raksha Bandhan',
    badge: 'Best Combo',
    rating: 5.0,
    numReviews: 52,
    tags: ['Rakhi Combo', 'Sweets', 'Gift Box']
  },

  // 11. Exclusive Rakhi Sets
  {
    name: 'Royal Bhaiya-Bhabhi & Family Rakhi Set',
    slug: 'royal-bhaiya-bhabhi-family-rakhi-set',
    description: 'A matching set of handcrafted Rakhi for Brother, Lumba for Bhabhi, and 2 Kids Rakhis embellished with pearls and zari.',
    category: 'Rakhis',
    subCategory: 'Exclusive Rakhi Sets',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'],
    price: 899,
    mrp: 1499,
    availableQuantity: 30,
    sku: 'RAK-EXC-011',
    festivalTag: 'Raksha Bandhan',
    badge: 'Exclusive Set',
    rating: 5.0,
    numReviews: 42,
    tags: ['Lumba', 'Pearl', 'Exclusive Set']
  },

  // Other categories
  {
    name: 'Artisanal Almond & Pistachio Mithai Box',
    slug: 'artisanal-almond-pistachio-mithai-box',
    description: 'Pure saffron-infused dry fruit bites crafted with organic California almonds and Iranian pistachios.',
    category: 'Sweets',
    subCategory: 'Dry Fruit Sweets',
    images: ['https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80'],
    price: 749,
    mrp: 1199,
    availableQuantity: 25,
    sku: 'SWT-BOX-004',
    festivalTag: 'Raksha Bandhan',
    badge: 'Freshly Made',
    rating: 4.9,
    numReviews: 31,
    tags: ['Gourmet', 'Mithai', 'Organic']
  },
  {
    name: 'Rose Gold Eternal Sibling Hamper',
    slug: 'rose-gold-eternal-sibling-hamper',
    description: 'The ultimate gesture of affection: Includes 1 Premium Kundan Rakhi, 250g Artisanal Mithai Box, personalized bookmark, and note card.',
    category: 'Gifts',
    subCategory: 'Luxury Hampers',
    images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80'],
    price: 1299,
    mrp: 2499,
    availableQuantity: 20,
    sku: 'GFT-HMP-005',
    festivalTag: 'Raksha Bandhan',
    badge: 'Premium Gift',
    rating: 5.0,
    numReviews: 54,
    tags: ['Hamper', 'Gift Set', 'Luxury Box']
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

module.exports = { seedCategories, seedProducts, seedCoupons };
