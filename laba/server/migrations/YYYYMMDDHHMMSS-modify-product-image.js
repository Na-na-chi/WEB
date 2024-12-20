'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default-product.jpg'
    });
  }
}; 