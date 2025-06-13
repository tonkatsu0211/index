"use strict";
const express = require('express');
const app = express();
const path = require('path');
//const session = require('express-session');

//app.use(session({
    //secret: "tonkatsu0211",
    //resave: false,
    //saveUninitialized: true,
    //cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 }
//}));

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get(["/", "/index", "/index/", "/top", "/top/"], (req, res) => {
  const from = req.query.f || "";
  res.render("index", { from, title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
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
  res.render("contact", { title: "お問い合わせ", page: "contact", top: "お問い合わせ"});
});

app.get(["/beforeBreak", "/beforeBreak/"], (req, res) => {
  res.render("beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get(["/updates", "/updates/"], (req, res) => {
  res.render("updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

//app.get(["/snow", "/snow/"], (req, res) => {
  //res.render("snow", { title: "tonkatsu0211のページ"});
//});

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
