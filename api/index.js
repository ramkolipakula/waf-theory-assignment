import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB Atlas IP whitelist allows access from anywhere (0.0.0.0/0).',
    });
  }
  return app(req, res);
}
