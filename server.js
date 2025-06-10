"use strict";
const express = require('express');
const app = express();
const path = require('path');

// ─── ① すべての GET ルートをここに .................................................................
app.get(['/', '/index'], (req, res) => {
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

app.get('/contact*', (req, res) => {
  console.log('CONTACT wildcard match:', req.path);
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

app.get('/breakHistory', (req, res) => {
  res.sendFile(path.join(__dirname, 'breakHistory.html'));
});

// ─── ③ 404−リダイレクト処理 ...................................................................
app.use((req, res) => {
  const pageName = req.path.replace('/', '');
  console.log('Fallback 404 for:', req.path);
  res.status(404).redirect(`/error.html?e=${encodeURIComponent(pageName)}`);
});

const listener = app.listen(process.env.PORT, () => {
  console.log('App listening on port ' + listener.address().port);
});
