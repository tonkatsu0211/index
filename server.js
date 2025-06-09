const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/constructing.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'constructing.html'));
});

app.get('/popular.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'popular.html'));
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + listener.address().port);
});
