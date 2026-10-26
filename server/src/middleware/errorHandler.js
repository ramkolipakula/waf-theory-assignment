// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with specified ID (${err.value})`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `A record with this ${field} already exists. Please use another value.`;
    return res.status(409).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum allowed limit of 5MB.',
    });
  }

  // Default server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
