const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS — router's default DNS doesn't support MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout per attempt
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (retryCount < MAX_RETRIES) {
      const delay = (retryCount + 1) * 5000;
      console.log(`🔄 Retrying connection in ${delay / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      console.error('❌ Max retries reached. Could not connect to MongoDB.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
