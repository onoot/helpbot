import express from 'express';
import sequelize from './config/database.mjs';
import faqRoutes from './routes/faqRoutes.mjs';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Подключение маршрутов
app.use('/api/faqs', faqRoutes);

// Синхронизация с базой данных и запуск сервера
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('База данных синхронизирована.');
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
});
