const { MongoClient } = require('mongodb');

// URL для подключения к вашей базе данных MongoDB
const uri = 'mongodb+srv://admin:12345@jettracker.xvsim3k.mongodb.net/BusTracker';

// Создаем новый MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Подключаемся к серверу MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Подключено к MongoDB');

    // Ваш код работы с базой данных MongoDB здесь

  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  } finally {
    // Не забудьте закрыть соединение при завершении работы
    await client.close();
    console.log('Соединение с MongoDB закрыто');
  }
}

// Вызываем функцию подключения
connectToMongo();