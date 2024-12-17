const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  // Логируем ошибку
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Определяем статус ошибки
  const status = err.status || 500;
  const message = status === 500 
    ? 'Внутренняя ошибка сервера' 
    : err.message;

  // Отправляем ответ
  res.status(status).json({
    error: {
      message,
      status,
      // Добавляем детали ошибки только в режиме разработки
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler; 