const express = require('express');
const app = express();
const regroutes = require('./registration');
const procroutes = require('./process');

const PORT = process.env.PORT || 3000;

app.use('', regroutes);
app.use('', procroutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

app.get('*', (req, res) => {
    res.send('Hello from Node.js API');
  });
  
  // Обработка всех POST-запросов
  app.post('*', (req, res) => {
    res.send('POST request received');
  });
  

