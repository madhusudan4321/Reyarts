/**
 * createAdmin.js
 * ─────────────────────────────────────────────────────────────────────────
 * One-time script to create the pre-registered admin user: Reya Saran.
 * 
 * Usage:
 *   npm run create-admin
 *
 * The admin credentials are read from your .env file:
 *   ADMIN_EMAIL    → email address for the admin account
 *   ADMIN_PASSWORD → password for the admin account
 * ─────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

// Force Google DNS — router's default DNS doesn't support MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ── Use the REAL User model (has bcrypt pre-save hook) ───────────────────────
const User = require('../models/User');

// ── Connect to MongoDB ───────────────────────────────────────────────────────
const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }
  if (uri.includes('mongodb.net/?') || uri.endsWith('.net/')) {
    uri = uri.replace('.net/?', '.net/reyarts?').replace('.net/', '.net/reyarts');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected to MongoDB');
};

// ── Main ──────────────────────────────────────────────────────────────────────
const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('\n❌ Missing required environment variables:');
      console.error('   Add these to your backend/.env file:\n');
      console.error('   ADMIN_EMAIL=your_admin_email@example.com');
      console.error('   ADMIN_PASSWORD=YourSecurePassword123\n');
      process.exit(1);
    }

    // Delete any existing admin with this email (clears previously double-hashed password)
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      await User.deleteOne({ email: adminEmail });
      console.log(`🗑️  Removed existing user: ${adminEmail} (recreating with correct password hash)`);
    }

    // Create admin — the User model's pre('save') hook hashes the password correctly
    const admin = await User.create({
      name: 'Reya Saran',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      bio: 'Artist, painter, and storyteller.',
    });

    console.log('\n🎉 Admin user created successfully!\n');
    console.log('   Name  :', admin.name);
    console.log('   Email :', admin.email);
    console.log('   Role  :', admin.role);
    console.log('\n   Login at: http://localhost:5173/login');
    console.log('   Dashboard: http://localhost:5173/admin\n');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
};

createAdmin();
