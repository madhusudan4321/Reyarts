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
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Connect to MongoDB ───────────────────────────────────────────────────────
const connectDB = async () => {
  // Ensure the URI contains the database name "reyarts"
  let uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }

  // If URI has no database name before "?", inject "reyarts"
  if (uri.includes('mongodb.net/?') || uri.endsWith('.net/')) {
    uri = uri.replace('.net/?', '.net/reyarts?').replace('.net/', '.net/reyarts');
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
};

// ── Inline User Schema (to avoid circular imports) ───────────────────────────
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      if (existing.role === 'admin') {
        console.log(`\n⚠️  Admin already exists: ${existing.name} (${existing.email})`);
        console.log('   No changes made.\n');
      } else {
        // Upgrade existing user to admin
        existing.role = 'admin';
        await existing.save();
        console.log(`\n✅ Upgraded existing user to admin: ${existing.name} (${existing.email})\n`);
      }
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const admin = await User.create({
      name: 'Reya Saran',
      email: adminEmail,
      password: hashedPassword,
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
