const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrder, validateId } = require('../middleware/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - id
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: ID товара
 *         quantity:
 *           type: integer
 *           description: Количество товара
 *     Order:
 *       type: object
 *       required:
 *         - customerName
 *         - totalAmount
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *           description: ID заказа
 *         customerName:
 *           type: string
 *           description: Имя покупателя
 *         totalAmount:
 *           type: number
 *           description: Общая сумма заказа
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           description: Статус заказа
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Получить список всех заказов
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Список заказов успешно получен
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать новый заказ
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - totalAmount
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 */
router.post('/', validateOrder, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Обновить статус заказа
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 */
router.put('/:id/status', validateId, orderController.updateOrderStatus);

module.exports = router; 