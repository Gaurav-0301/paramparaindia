const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const FestivalConfig = require('../models/FestivalConfig');
const { seedCategories, seedProducts, seedCoupons } = require('./seedData');

dotenv.config({ path: __dirname + '/../.env' });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parampara_india';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Seeding...');

    // Seed Categories if empty or incomplete
    for (const catData of seedCategories) {
      await Category.findOneAndUpdate(
        { slug: catData.slug },
        { $setOnInsert: catData },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`Successfully verified/seeded all ${seedCategories.length} Rakhi Subcategories!`);

    // Seed products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log('Successfully seeded soft-luxury festival products!');
    } else {
      // Upsert seed products to ensure subcategory coverage
      for (const prodData of seedProducts) {
        const existing = await Product.findOne({ slug: prodData.slug });
        if (!existing) {
          await Product.create(prodData);
        }
      }
    }

    // Seed coupons if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(seedCoupons);
      console.log('Successfully seeded default discount coupons!');
    }

    // Seed admin user (8600475388) if empty
    let adminUser = await User.findOne({ mobile: '8600475388' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Parampara Admin',
        mobile: '8600475388',
        email: 'admin@paramparaindia.shop',
        role: 'admin',
        isVerified: true
      });
      console.log('Successfully created Admin User (+91 8600475388)!');
    } else if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      await adminUser.save();
    }

    // Seed sample customer & order for graph analytics initial state if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      let sampleCustomer = await User.findOne({ mobile: '9876543210' });
      if (!sampleCustomer) {
        sampleCustomer = await User.create({
          name: 'Aarav Sharma',
          mobile: '9876543210',
          email: 'aarav@example.com',
          role: 'customer',
          savedAddresses: [{
            label: 'Home',
            fullName: 'Aarav Sharma',
            mobile: '9876543210',
            streetAddress: '42 Heritage Villa, Park Street',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            isDefault: true
          }]
        });
      }

      const sampleProducts = await Product.find().limit(2);
      if (sampleProducts.length >= 2) {
        const order1 = new Order({
          orderId: 'PI-2026-10024',
          user: sampleCustomer._id,
          orderItems: [
            {
              product: sampleProducts[0]._id,
              name: sampleProducts[0].name,
              price: sampleProducts[0].price,
              mrp: sampleProducts[0].mrp,
              qty: 2,
              image: sampleProducts[0].images[0]
            }
          ],
          shippingAddress: sampleCustomer.savedAddresses[0],
          paymentMethod: 'Razorpay',
          paymentDetails: { razorpayOrderId: 'order_test_123', status: 'Paid' },
          pricing: { subtotal: 998, discount: 100, shippingFee: 0, total: 898 },
          orderStatus: 'Confirmed',
          statusHistory: [{ status: 'Placed' }, { status: 'Confirmed' }]
        });
        await order1.save();

        const order2 = new Order({
          orderId: 'PI-2026-10025',
          user: sampleCustomer._id,
          orderItems: [
            {
              product: sampleProducts[1]._id,
              name: sampleProducts[1].name,
              price: sampleProducts[1].price,
              mrp: sampleProducts[1].mrp,
              qty: 1,
              image: sampleProducts[1].images[0]
            }
          ],
          shippingAddress: sampleCustomer.savedAddresses[0],
          paymentMethod: 'COD',
          paymentDetails: { status: 'COD' },
          pricing: { subtotal: 399, discount: 0, shippingFee: 49, total: 448 },
          orderStatus: 'Shipped',
          statusHistory: [{ status: 'Placed' }, { status: 'Confirmed' }, { status: 'Shipped' }]
        });
        await order2.save();

        console.log('Successfully seeded sample orders for graph analytics!');
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding Error:', error.message);
  }
};

module.exports = seedDB;

if (require.main === module) {
  seedDB().then(() => process.exit(0));
}
