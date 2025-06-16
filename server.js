"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

function render(res, view, data = {}) {
    res.render(view, data, (err, html) => {
      if (err) {
       res.status(404).redirect(`/error?e=${view}`); 
      } else {
        res.send(html);
      }
    });
}

app.get(["/", "/index", "/top", "/index.html"], (req, res) => {
  const from = req.query.f || "";
  render(res, "index", { from, title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
});

app.get(["/my", "/my.html"], (req, res) => {
  render(res, "my", { title: "自己紹介(事故紹介)", page: "my", top: "自己紹介(事故紹介)"});
});

app.get(["/projects", "/projects.html"], (req, res) => {
  render(res, "projects", { title: "作品", page: "projects", top: "Scratchの作品"});
});

app.get("/const", (req, res) => {
  render(res, "constructing", { title: "建設中のページ", page: "const", top: "建設中"});
});

app.get(["/constructing", "/const", "constructing.html"], (req, res) => {
  render(res, "constructing", { title: "建設中のページ", page: "constructing", top: "建設中"});
});

app.get("/const1", (req, res) => {
  render(res, "constructing", { title: "建設中のページ", page: "const1", top: "建設中"});
});

app.get(["/constructing1", "/const1", "constructing1.html"], (req, res) => {
  render(res, "constructing1", { title: "建設中のページ", page: "constructing1", top: "建設中"});
});

app.get(["/contact", "/contact.html"], (req, res) => {
  render(res, "contact", { title: "お問い合わせ", page: "contact", top: "お問い合わせ"});
});

app.get(["/beforeBreak", "/beforeBreak.html"], (req, res) => {
  render(res, "beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get(["/updates", "/updates.html"], (req, res) => {
  render(res, "updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

app.get(["/games", "/games.html"], (req, res) => {
  render(res, "games", { title: "tonkatsu0211のページ", page: "games", top: "ゲームをプレイ"});
});

app.get(["/snow", "/snow.html"], (req, res) => {
  render(res, "snow", { title: "tonkatsu0211のページ"});
});

app.get(["/stickman", "/stickman.html"], (req, res) => {
  render(res, "stickman", { title: "tonkatsu0211のページ"});
});

app.get(["/error", "/error.html"], (req, res) => {
  render(res, "error", { title: "404 Not Found", page: "error"});
});

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  res.status(404).redirect(`/error?e=${encodeURIComponent(pageName)}`);
});

const port = process.env.PORT || 3000;
const listener = app.listen(process.env.PORT, () => {
  console.log("App listening on port " + listener.address().port);
});
