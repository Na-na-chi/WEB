const app = require('./app');
const sequelize = require('./config/database');

// Database sync and server start
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 