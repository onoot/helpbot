// seedDatabase.mjs
import sequelize from './config/database.mjs';
import FAQ from './models/FAQ.mjs';

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); 
    console.log('База данных синхронизирована.');

    // Первые данные 
    const faqs = [
      {
        module: 'Управление пользователями',
        subcategory: 'Аутентификация',
        name: 'Проблемы со входом',
        question: 'Как мне сбросить пароль?',
        answer: 'Перейдите на страницу входа и нажмите на "Забыли пароль?", чтобы сбросить его.',
      },
      {
        module: 'Управление пользователями',
        subcategory: 'Аккаунт',
        name: 'Обновление профиля',
        question: 'Как обновить информацию в профиле?',
        answer: 'Перейдите на страницу настроек, чтобы обновить данные профиля.',
      },
      {
        module: 'Оплата',
        subcategory: 'Счета',
        name: 'Создание счета',
        question: 'Как скачать свои счета?',
        answer: 'Перейдите в раздел "Оплата" и нажмите на значок скачивания рядом со счетом.',
      },
      {
        module: 'Оплата',
        subcategory: 'Платежи',
        name: 'Проблемы с платежами',
        question: 'Какие способы оплаты принимаются?',
        answer: 'Мы принимаем Visa, MasterCard и PayPal.',
      },
      {
        module: 'Поддержка',
        subcategory: 'Техническая поддержка',
        name: 'Устранение неполадок',
        question: 'Как связаться с поддержкой?',
        answer: 'Посетите страницу поддержки и отправьте заявку.',
      },
      {
        module: 'Поддержка',
        subcategory: 'Техническая поддержка',
        name: 'Чат с оператором',
        question: 'Доступен ли онлайн-чат?',
        answer: 'Да, онлайн-чат доступен с 9:00 до 17:00 по восточному времени.',
      },
    ];

    // Добавление записей в таблицу FAQ
    await FAQ.bulkCreate(faqs);
    console.log('База данных успешно заполнена тестовыми данными.');

  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
