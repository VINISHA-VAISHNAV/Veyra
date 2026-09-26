const User = require('../models/User');
const Product = require('../models/Product');

const seedProducts = [
  {
    name: 'VEYRA Horizon ANC Headphones',
    description:
      'Precision-engineered wireless acoustic headphones featuring bespoke 40mm titanium drivers, adaptive hybrid active noise cancellation, 45-hour battery reserve, and memory-foam ear cushions wrapped in tactile vegan leather.',
    price: 299.0,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    stock: 18,
    featured: true,
  },
  {
    name: 'VEYRA Apex Chrono Smartwatch',
    description:
      'Sleek aerospace-grade aluminum casing with an edge-to-edge sapphire crystal AMOLED display. Features all-day health telemetry, biometric HRV tracking, 5ATM water resistance, and 7-day battery endurance.',
    price: 249.0,
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    stock: 14,
    featured: true,
  },
  {
    name: 'VEYRA Pulse Studio Earbuds',
    description:
      'Ultra-low latency wireless earbuds calibrated for pure studio fidelity. Dual-transducer acoustic chambers, beamforming wind-filtering microphones, IPX5 water resistance, and wireless Qi charge case.',
    price: 159.0,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    stock: 25,
    featured: false,
  },
  {
    name: 'VEYRA Beam 4K Portable Projector',
    description:
      'Ultra-compact cinema projector delivering razor-sharp 4K HDR projection up to 150 inches. Built-in Harman Kardon acoustics, autofocus keystone calibration, and 3-hour cord-free playback.',
    price: 489.0,
    category: 'Tech',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    stock: 8,
    featured: true,
  },
  {
    name: 'VEYRA Orbit Magnetic Power Bank 10K',
    description:
      'Slimline 10,000mAh magnetic portable charger with 15W high-speed wireless charging and 20W USB-C Power Delivery. Finished in sandblasted anodized space-gray aluminum.',
    price: 65.0,
    category: 'Tech',
    image:
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=1000&q=80',
    stock: 30,
    featured: false,
  },
  {
    name: 'VEYRA Lumina Desk Mat & MagPad',
    description:
      'Handcrafted vegan saffiano leather desk pad integrated with a dual-device magnetic induction charging zone. Water-resistant, heat-dissipating base, and anti-slip backing.',
    price: 79.0,
    category: 'Lifestyle',
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    stock: 22,
    featured: true,
  },
  {
    name: 'VEYRA Minimalist MagSafe Cardholder',
    description:
      'Machined grade-5 titanium wallet holding up to 6 cards with integrated RFID blocking and a precision friction hinge that functions as an ergonomic phone stand.',
    price: 49.0,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
    stock: 40,
    featured: false,
  },
  {
    name: 'VEYRA Terra Ceramic Travel Tumbler',
    description:
      'Double-walled vacuum insulated stainless steel with an interior pure ceramic coating that preserves taste purity. 18-hour thermal retention with leakproof 360-degree sip lid.',
    price: 38.0,
    category: 'Lifestyle',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
    stock: 35,
    featured: false,
  },
];

const seedDatabase = async () => {
  try {
    // 1. Seed Admin User if not existing
    const adminEmail = (
      process.env.ADMIN_EMAIL || 'admin@veyra.com'
    ).toLowerCase();

    const adminPassword = process.env.ADMIN_PASSWORD;

    // Never create an admin with a hardcoded password.
    if (!adminPassword) {
      throw new Error(
        'ADMIN_PASSWORD is not configured. Add it to server/.env before starting VEYRA.'
      );
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'VEYRA Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      console.log(`[VEYRA Seed] Admin user created: ${adminEmail}`);
    } else {
      console.log(
        `[VEYRA Seed] Admin user already exists: ${adminEmail}`
      );
    }

    // 2. Seed Products if collection is empty
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      await Product.insertMany(seedProducts);

      console.log(
        `[VEYRA Seed] Successfully seeded ${seedProducts.length} curated products.`
      );
    } else {
      console.log(
        `[VEYRA Seed] Products already present (${productCount} items). Skipping product seed.`
      );
    }
  } catch (error) {
    console.error(
      '[VEYRA Seed] Error during database seeding:',
      error.message
    );
  }
};

module.exports = seedDatabase;
