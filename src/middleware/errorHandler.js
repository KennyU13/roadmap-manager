const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (res.headersSent) {
    return next(error);
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error({
      message: error.message,
      statusCode,
      path: req.originalUrl,
      method: req.method,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

module.exports = {
  notFound,
  errorHandler
};
