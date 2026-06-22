const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');

const products = [
  {
    name: 'NebulaSound Pro Wireless Headphones',
    description: 'Experience the cosmos through sound. These premium wireless headphones deliver 40-hour battery life, active noise cancellation, and a deep bass universe that will transport you to another dimension.',
    price: 8999,
    originalPrice: 12999,
    category: 'Electronics',
    brand: 'NebulaTech',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    isFeatured: true,
    discount: 30,
    tags: ['headphones', 'wireless', 'audio'],
  },
  {
    name: 'Cosmic Smartwatch Series X',
    description: 'Track your journey through the universe with this intelligent smartwatch. Features health monitoring, GPS, 5-day battery life and a stunning AMOLED display.',
    price: 14999,
    originalPrice: 19999,
    category: 'Electronics',
    brand: 'NebulaTech',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 30,
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    discount: 25,
    tags: ['smartwatch', 'wearable', 'fitness'],
  },
  {
    name: 'StarField Gaming Mechanical Keyboard',
    description: 'RGB-backlit mechanical keyboard with tactile switches designed for long gaming sessions. Each keystroke launches you deeper into the gaming universe.',
    price: 5499,
    originalPrice: 7999,
    category: 'Electronics',
    brand: 'StarField Gaming',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'],
    stock: 75,
    rating: 4.3,
    numReviews: 56,
    isFeatured: false,
    discount: 31,
    tags: ['gaming', 'keyboard', 'rgb'],
  },
  {
    name: 'Galaxy Fold Laptop Stand',
    description: 'Adjustable aluminum laptop stand for your space station setup. Supports up to 20kg, folds completely flat for portability.',
    price: 1999,
    originalPrice: 2999,
    category: 'Electronics',
    brand: 'OrbitalDesk',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    stock: 120,
    rating: 4.2,
    numReviews: 34,
    isFeatured: false,
    discount: 33,
    tags: ['laptop', 'stand', 'workspace'],
  },
  {
    name: 'Aurora Running Shoes',
    description: 'Lightweight running shoes with cloud-cushion technology. The nebula-inspired colorway makes every run feel like a journey through the northern lights.',
    price: 4299,
    originalPrice: 5999,
    category: 'Sports',
    brand: 'AuroraRun',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 80,
    rating: 4.6,
    numReviews: 210,
    isFeatured: true,
    discount: 28,
    tags: ['shoes', 'running', 'fitness'],
  },
  {
    name: 'Cosmos Yoga Mat Premium',
    description: 'Extra-thick 6mm yoga mat with celestial mandala print. Non-slip surface, eco-friendly TPE material, and carrying strap included.',
    price: 1599,
    originalPrice: 2499,
    category: 'Sports',
    brand: 'ZenCosmos',
    images: ['https://images.unsplash.com/photo-1601925228732-6a9bdbe7fa97?w=500'],
    stock: 200,
    rating: 4.4,
    numReviews: 67,
    isFeatured: false,
    discount: 36,
    tags: ['yoga', 'fitness', 'wellness'],
  },
  {
    name: 'Orbital Backpack 40L',
    description: 'Professional travel backpack with anti-theft design, USB charging port, and laptop compartment. Built to travel between galaxies.',
    price: 3499,
    originalPrice: 4999,
    category: 'Fashion',
    brand: 'OrbitGear',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    stock: 45,
    rating: 4.8,
    numReviews: 142,
    isFeatured: true,
    discount: 30,
    tags: ['backpack', 'travel', 'bag'],
  },
  {
    name: 'Nebula Chronograph Watch',
    description: 'Classic analog chronograph with sapphire crystal and cosmic dial. Water-resistant to 100m. The universe on your wrist.',
    price: 9999,
    originalPrice: 14999,
    category: 'Fashion',
    brand: 'NebulaTech',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'],
    stock: 20,
    rating: 4.9,
    numReviews: 45,
    isFeatured: true,
    discount: 33,
    tags: ['watch', 'luxury', 'accessories'],
  },
  {
    name: 'Starlight Desk Lamp LED',
    description: 'Smart LED desk lamp with wireless charging pad, touch dimming, and 4 color temperature modes. Illuminate your workspace like a supernova.',
    price: 2299,
    originalPrice: 3499,
    category: 'Home & Living',
    brand: 'LumosHome',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    stock: 90,
    rating: 4.1,
    numReviews: 78,
    isFeatured: false,
    discount: 34,
    tags: ['lamp', 'desk', 'smart'],
  },
  {
    name: 'Pulsar Bluetooth Speaker',
    description: '360-degree surround sound speaker, IPX7 waterproof, 24-hour playback. Bring cosmic beats to any environment on Earth.',
    price: 3999,
    originalPrice: 5499,
    category: 'Electronics',
    brand: 'NebulaTech',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    stock: 60,
    rating: 4.5,
    numReviews: 93,
    isFeatured: false,
    discount: 27,
    tags: ['speaker', 'bluetooth', 'audio'],
  },
  {
    name: 'Comet Coffee Maker 12-Cup',
    description: 'Programmable coffee maker with thermal carafe, brew strength control, and built-in grinder. Start every morning like a cosmic event.',
    price: 6999,
    originalPrice: 9999,
    category: 'Home & Living',
    brand: 'BrewCosmos',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
    stock: 35,
    rating: 4.3,
    numReviews: 156,
    isFeatured: false,
    discount: 30,
    tags: ['coffee', 'kitchen', 'appliance'],
  },
  {
    name: 'Andromeda Skincare Set',
    description: 'Complete 5-step skincare routine with vitamin C serum, hyaluronic acid moisturizer, and SPF 50 sunscreen. Derived from celestial botanicals.',
    price: 2799,
    originalPrice: 3999,
    category: 'Beauty',
    brand: 'GlowNebula',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500'],
    stock: 100,
    rating: 4.7,
    numReviews: 234,
    isFeatured: true,
    discount: 30,
    tags: ['skincare', 'beauty', 'wellness'],
  },
];

const coupons = [
  { code: 'NEBULA10', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, expiresAt: new Date('2025-12-31'), usageLimit: 1000 },
  { code: 'SPACE20', discountType: 'percentage', discountValue: 20, minOrderAmount: 2000, maxDiscountAmount: 500, expiresAt: new Date('2025-12-31'), usageLimit: 500 },
  { code: 'COSMOS200', discountType: 'fixed', discountValue: 200, minOrderAmount: 1000, expiresAt: new Date('2025-12-31') },
  { code: 'LAUNCH50', discountType: 'percentage', discountValue: 50, minOrderAmount: 3000, maxDiscountAmount: 1000, expiresAt: new Date('2025-06-30'), usageLimit: 100 },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin NebulaCart',
      email: 'admin@nebulacart.com',
      password: 'admin123456',
      role: 'admin',
    });

    // Create test customer
    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'customer123',
      role: 'user',
    });

    await Product.insertMany(products);
    await Coupon.insertMany(coupons);

    console.log('✅ Data seeded successfully!');
    console.log('Admin: admin@nebulacart.com / admin123456');
    console.log('Customer: customer@test.com / customer123');
    process.exit();
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    console.log('✅ Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else importData();
