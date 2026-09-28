require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fan_hub_plus';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected for seeding default accounts...');

    // Seed Admin Account
    const adminEmail = 'admin@fanhub.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        favorite_fandoms: ['Anime', 'Gaming', 'Movies', 'TV Shows'],
      });
      console.log('👤 Admin user seeded: admin@fanhub.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // Seed Regular User Account
    const userEmail = 'user@fanhub.com';
    let regUser = await User.findOne({ email: userEmail });
    if (!regUser) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('user123', salt);
      regUser = await User.create({
        name: 'Regular Fan',
        email: userEmail,
        password: hashedPassword,
        role: 'user',
        favorite_fandoms: ['Anime', 'K-Pop', 'Cosplay'],
      });
      console.log('👤 Regular user seeded: user@fanhub.com / user123');
    } else {
      console.log('ℹ️ Regular user already exists.');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();
