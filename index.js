const express = require('express');
const app = express();
const regroutes = require('./registration');
const procroutes = require('./process');
const cors = require('cors');

// Использование CORS middleware
app.use(cors());

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
const corsOptions = {
  origin: 'http://localhost:3000', // Разрешить запросы только с этого источника
  methods: ['GET', 'POST'], // Разрешенные HTTP-методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
};

// Использование настроенного CORS middleware
app.use(cors(corsOptions));

  
  app.use('', regroutes);
  app.use('', procroutes);

