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

app.get('/popular.html', (req, res) => {
  res.redirect('error.html?e=popular');
});

app.get('/:page/', (req, res) => {
  const pageName = req.params.page;
  res.redirect(`/error.html?e=${encodeURIComponent(pageName)}`);
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
