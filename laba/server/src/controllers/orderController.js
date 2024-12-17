const Order = require('../models/Order');
const Product = require('../models/Product');
const sequelize = require('../config/database');

const orderController = {
  // Получить все заказы
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        message: 'Ошибка при получении заказов', 
        error: error.message 
      });
    }
  },

  // Создать заказ
  async createOrder(req, res) {
    const t = await sequelize.transaction();

    try {
      const { customerName, totalAmount, items } = req.body;

      // Проверяем наличие товаров
      for (const item of items) {
        const product = await Product.findByPk(item.id);
        if (!product) {
          throw new Error(`Товар с ID ${item.id} не найден`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Недостаточно товара "${product.name}" на складе`);
        }
      }

      // Создаем заказ
      const order = await Order.create({
        customerName,
        totalAmount,
        status: 'pending'
      }, { transaction: t });

      // Обновляем количество товаров
      for (const item of items) {
        const product = await Product.findByPk(item.id);
        product.stock -= item.quantity;
        await product.save({ transaction: t });
      }

      await t.commit();
      res.status(201).json(order);
    } catch (error) {
      await t.rollback();
      res.status(400).json({ 
        message: 'Ошибка при создании заказа', 
        error: error.message 
      });
    }
  },

  // Обновить статус заказа
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [updated] = await Order.update(
        { status },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }

      const updatedOrder = await Order.findByPk(id);
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ 
        message: 'Ошибка при обновлении статуса заказа', 
        error: error.message 
      });
    }
  }
};

module.exports = orderController; 