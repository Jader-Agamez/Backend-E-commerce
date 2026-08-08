const errorHandler = (err, req, res, next) => {
  // Log error with stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);
  } else {
    // In production, log less details
    console.error(`[ERROR] ${err.name}: ${err.message}`);
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.errors.map((e) => e.message),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expirado' });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  // Default error response
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? (statusCode === 500 ? 'Error interno del servidor' : err.message)
    : (err.message || 'Error interno del servidor');

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
