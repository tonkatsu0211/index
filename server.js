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

app.get("/app1",(req, res) => {
  res.render("../public/contact.ejs")
})

app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

app.get('/breakHistory', (req, res) => {
  res.sendFile(path.join(__dirname, 'breakHistory.html'));
});

app.use((req, res) => {
  const pageName = req.path.replace('/', '');
  res.redirect(`/error.html?e=${encodeURIComponent(pageName)}`);
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
