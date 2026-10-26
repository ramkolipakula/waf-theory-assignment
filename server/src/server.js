import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start Express server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` CivicConnect Backend Service is Running!`);
    console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(` Port        : ${PORT}`);
    console.log(` API URL     : http://localhost:${PORT}/api`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer().catch((err) => {
  console.error('Fatal error starting CivicConnect server:', err);
  process.exit(1);
});
