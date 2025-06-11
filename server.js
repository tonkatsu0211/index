"use strict";
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get(["/", "/index", "/index/", "/top", "/top/"], (req, res) => {
  res.render("index.html", { title: "_tonkatsu_のページ"});
});

app.get(["/my", "/my/"], (req, res) => {
  res.render("my.html", { title: "_tonkatsu_の自己紹介(事故紹介)"});
});

app.get(["/projects", "/projects/"], (req, res) => {
  res.render("projects.html", { title: "tonkatsu0211の作品"});
});

app.get(["/constructing", "/constructing/"], (req, res) => {
  res.render("constructing.html", { title: "建設中のページ"});
});

app.get(["/constructing1", "/constructing1/"], (req, res) => {
  res.render("constructing1.html", { title: "建設中のページ"});
});

app.get(["/contact", "/contact/"], (req, res) => {
  res.render("contact.html", { title: "_tonkatsu_への連絡先"});
});

app.get(["/beforeBreak", "/beforeBreak/"], (req, res) => {
  res.render("beforeBreak.html", { title: "_tonkatsu_のページ"});
});

app.get(["/updates", "/updates/"], (req, res) => {
  res.render("updates.html", { title: "ページ更新履歴"});
});

app.get(["/error", "/error/"], (req, res) => {
  res.render("error.html", { title: "404 Not Found"});
});

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  res.status(404).render(`/error?e=${encodeURIComponent(pageName)}`, { title: "404 Not Found"});
});

const port = process.env.PORT || 3000;
const listener = app.listen(process.env.PORT, () => {
  console.log("App listening on port " + listener.address().port);
});

app.get('/', (req, res) => {
  res.render('index', { title: 'ホーム' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: '連絡先' });
});
