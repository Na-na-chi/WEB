const { body, param, validationResult } = require('express-validator');

// Обработчик ошибок валидации
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Ошибка валидации',
      errors: errors.array() 
    });
  }
  next();
};

// Валидация для создания/обновления товара
const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Название товара обязательно')
    .isLength({ min: 2, max: 100 }).withMessage('Название должно быть от 2 до 100 символов'),
  
  body('price')
    .notEmpty().withMessage('Цена обязательна')
    .isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Описание не должно превышать 1000 символов'),
  
  body('stock')
    .notEmpty().withMessage('Количество обязательно')
    .isInt({ min: 0 }).withMessage('Количество должно быть неотрицательным числом'),
  
  body('image')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch (error) {
        throw new Error('Некорректный URL изображения');
      }
    }),
  
  handleValidationErrors
];

// Валидация для создания заказа
const validateOrder = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Имя покупателя обязательно'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Сумма заказа должна быть положительным числом'),
  body('items')
    .isArray()
    .withMessage('Список товаров должен быть массивом')
    .notEmpty()
    .withMessage('Заказ должен содержать хотя бы один товар'),
  body('items.*.id')
    .isInt({ min: 1 })
    .withMessage('ID товара должен быть положительным числом'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Количество товара должно быть положительным числом'),
  handleValidationErrors
];

// Валидация ID в параметрах
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID должен быть положительным числом'),
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateOrder,
  validateId
}; 