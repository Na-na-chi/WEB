const Product = require('../models/Product');

const productController = {
  // Получить все товары
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ 
        message: 'Ошибка при получении товаров', 
        error: error.message 
      });
    }
  },

  // Получить товар по ID
  async getProductById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ 
        message: 'Ошибка при получении товара', 
        error: error.message 
      });
    }
  },

  // Создать товар
  async createProduct(req, res) {
    try {
      console.log('Received product data:', req.body);
      
      const { name, price, description, stock, image } = req.body;
      
      // Дополнительная проверка данных
      if (!name || !price || stock === undefined) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({
          message: 'Не все обязательные поля заполнены'
        });
      }

      const product = await Product.create({
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        image: image || null
      });

      console.log('Product created:', product.toJSON());
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ 
        message: 'Ошибка при создании товара',
        error: error.message 
      });
    }
  },

  // Обновить товар
  async updateProduct(req, res) {
    try {
      const [updated] = await Product.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) {
        return res.status(404).json({ message: 'Товар не найден' });
      }
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ 
        message: 'Ошибка при обновлении товара', 
        error: error.message 
      });
    }
  },

  // Удалить товар
  async deleteProduct(req, res) {
    try {
      const deleted = await Product.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) {
        return res.status(404).json({ message: 'Товар не найден' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: 'Ошибка при удалении товара', 
        error: error.message 
      });
    }
  },

  // Обновить количество товара
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Недостаточно товара на складе' });
      }

      product.stock -= quantity;
      await product.save();
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ 
        message: 'Ошибка при обновлении количества', 
        error: error.message 
      });
    }
  }
};

module.exports = productController; 