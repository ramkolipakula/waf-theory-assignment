import mongoose from 'mongoose';
import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  // Ensure MongoDB connection is active in serverless lifecycle
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[Vercel Serverless] Database connection error:', err);
    }
  }
  return app(req, res);
}
