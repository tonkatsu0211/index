"use strict";
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));

app.get(['/index' , '/index/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'my.html'));
});

app.get([/my' , '/my/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'my.html'));
});

app.get(['/projects' , '/projects/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get(['/constructing' , '/constructing/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'constructing.html'));
});

app.get(['/constructing1' , '/constructing1/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'constructing1.html'));
});

app.get(['/popular' , '/popular/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'popular.html'));
});

app.get(['/contact' , '/contact/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get(['/lobby' , '/lobby/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

app.get(['/breakHistory' , '/breakHistory/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'breakHistory.html'));
});

app.use((req, res) => {
  const pageName = req.path.replace('/', '');
  console.log('Fallback 404 for:', req.path);
  res.status(404).redirect(`/error.html?e=${encodeURIComponent(pageName)}`);
});

const listener = app.listen(process.env.PORT, () => {
  console.log('App listening on port ' + listener.address().port);
});
