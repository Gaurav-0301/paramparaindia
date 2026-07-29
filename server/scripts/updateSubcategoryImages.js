const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');

const CATEGORY_UPDATES = [
  {
    name: 'Bracelet & Combo Rakhi',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Designer & Pearl Rakhi',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Premium Rakhi',
    image: 'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Golden Rakhi',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Flower Design Rakhi',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Religious & Devotional Rakhi',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Kids & Charm Rakhi',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Peacock & Floral Rakhi',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Personalized Rakhi',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rakhi Combo',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Exclusive Rakhi Sets',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80'
  }
];

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected to update subcategory images...');

    for (const item of CATEGORY_UPDATES) {
      const res = await Category.findOneAndUpdate(
        { name: item.name },
        { $set: { image: item.image } },
        { returnDocument: 'after' }
      );
      if (res) {
        console.log(`Updated subcategory "${item.name}" -> ${item.image}`);
      } else {
        console.log(`Subcategory "${item.name}" not found in DB`);
      }
    }

    console.log('All subcategory images updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating subcategories:', err);
    process.exit(1);
  }
};

updateImages();
