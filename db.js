const mongoose = require('mongoose');

const url = process.env.MONGO_URI;
const dbName = 'forumdb'; // Sesuaikan dengan nama database Anda

async function connectDB() {
  try {
    await mongoose.connect(url, {
      dbName: dbName
    });
    console.log('MongoDB Connected:', url);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
}

const getDB = () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  } else {
    throw new Error('Database not initialized');
  }
};

module.exports = { connectDB, getDB };
