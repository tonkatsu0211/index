const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/constructing', (req, res) => {
  res.sendFile(path.join(__dirname, 'constructing.html'));
});

app.get('/constructing1', (req, res) => {
  res.sendFile(path.join(__dirname, 'constructing1.html'));
});

app.get('/popular', (req, res) => {
  res.sendFile(path.join(__dirname, 'popular.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
})

app.get('/lobby', (req, res) => {
  res.redirect('lobby.html');
})

app.get('/breakHistory', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
})

app.get((req, res) => {
  const pageName = req.params.page;
  res.status(404).sendFile(path.jpin(__dirname, `/error.html?e=${encodeURIComponent(pageName)}`));
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
