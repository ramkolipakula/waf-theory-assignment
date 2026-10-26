import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicconnect';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};
