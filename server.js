"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get(["/", "/index", "/top", "/index.html"], (req, res) => {
  const from = req.query.f || "";
  res.render("index", { from, title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
});

app.get(["/my", "/my.html"], (req, res) => {
  res.render("my", { title: "自己紹介(事故紹介)", page: "my", top: "自己紹介(事故紹介)"});
});

app.get(["/projects", "/projects.html"], (req, res) => {
  res.render("projects", { title: "作品", page: "projects", top: "Scratchの作品"});
});

app.get("/const", (req, res) => {
  res.render("constructing", { title: "建設中のページ", page: "const", top: "建設中"});
});

app.get(["/constructing", "/const", "constructing.html"], (req, res) => {
  res.render("constructing", { title: "建設中のページ", page: "constructing", top: "建設中"});
});

app.get("/const1", (req, res) => {
  res.render("constructing", { title: "建設中のページ", page: "const1", top: "建設中"});
});

app.get(["/constructing1", "/const1", "constructing1.html"], (req, res) => {
  res.render("constructing1", { title: "建設中のページ", page: "constructing1", top: "建設中"});
});

app.get(["/contact", "/contact.html"], (req, res) => {
  res.render("contact", { title: "お問い合わせ", page: "contact", top: "お問い合わせ"});
});

app.get(["/beforeBreak", "/beforeBreak.html"], (req, res) => {
  res.render("beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get(["/updates", "/updates.html"], (req, res) => {
  res.render("updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

app.get(["/lobby", "/lobby.html"], (req, res) => {
  res.render("lobby", { title: "tonkatsu0211のページ", page: "lobby", top: "snowball.ioをプレイ"});
});

app.get(["/snow", "/snow.html"], (req, res) => {
  const user = req.cookies.user || null;
  res.render("snow", { user,  title: "tonkatsu0211のページ"});
});

app.get(["/error", "/error.html"], (req, res) => {
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
