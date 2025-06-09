const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => {
  console.log('GET / accessed');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/const', '/const/'], (req, res) => {
  console.log('GET /const accessed');
  res.sendFile(path.join(__dirname, 'constructing.html'));
});

app.get('/temp.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'temp.html'));
});


const listener = app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + listener.address().port);
});
