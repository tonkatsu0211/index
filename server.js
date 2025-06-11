"use strict";
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static("views"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get(["/", "/index", "/index/", "/top", "/top/"], (req, res) => {
  res.render("index", { title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
});

app.get(["/my", "/my/"], (req, res) => {
  res.render("my", { title: "自己紹介(事故紹介)", page: "my", top: "自己紹介(事故紹介)"});
});

app.get(["/projects", "/projects/"], (req, res) => {
  res.render("projects", { title: "作品", page: "projects", top: "Scratchの作品"});
});

app.get(["/constructing", "/constructing/"], (req, res) => {
  res.render("constructing", { title: "建設中のページ", page: "constructing"});
});

app.get(["/constructing1", "/constructing1/"], (req, res) => {
  res.render("constructing1", { title: "建設中のページ", page: "constructing"});
});

app.get(["/contact", "/contact/"], (req, res) => {
  res.render("contact", { title: "連絡先", page: "contact", top: "マイリンク・連絡先"});
});

app.get(["/beforeBreak", "/beforeBreak/"], (req, res) => {
  res.render("beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get(["/updates", "/updates/"], (req, res) => {
  res.render("updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

app.get(["/error", "/error/"], (req, res) => {
  res.render("error", { title: "404 Not Found", page: "error"});
});

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  res.status(404).render(`/error?e=${encodeURIComponent(pageName)}`, { title: "404 Not Found"});
});

const port = process.env.PORT || 3000;
const listener = app.listen(process.env.PORT, () => {
  console.log("App listening on port " + listener.address().port);
});
