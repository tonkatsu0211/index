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

app.get("/index/", (req, res) => {
  res.redirect(301, "/index");
});

app.get("/top/", (req, res) => {
  res.redirect(301, "/top");
});

app.get(["/", "/index", "/top", "/index.html"], (req, res) => {
  const from = req.query.f || "";
  res.render("index", { from, title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
});

app.get("/my/", (req,res) => {
  res.redirect(301, "/my");
});

app.get(["/my", "/my.html"], (req, res) => {
  res.render("my", { title: "自己紹介(事故紹介)", page: "my", top: "自己紹介(事故紹介)"});
});

app.get("/project/", (req, res) => {
  res.redirect(301, "/projects");
});

app.get(["/projects", "/projects.html"], (req, res) => {
  res.render("projects", { title: "作品", page: "projects", top: "Scratchの作品"});
});

app.get("/constructing/", (req, res) => {
  res.redirect(301, "/constructing");
});

app.get("/const/", (req, res) => {
  res.direct(301, "/const");
});

app.get(["/constructing", "/const", "constructing.html"], (req, res) => {
  res.render("constructing", { title: "建設中のページ", page: "constructing", top: "建設中"});
});

app.get("/constructing1/", (req, res) => {
  res.redirect(301, "/constructing1");
});

app.get("/const1/", (req, res) => {
  res.direct(301, "/const1");
});

app.get(["/constructing1", "/const1", "constructing1.html"], (req, res) => {
  res.render("constructing1", { title: "建設中のページ", page: "constructing1", top: "建設中"});
});

app.get("/contact/", (req, res) => {
  res.redirect(301, "/contact");
});

app.get(["/contact", "/contact.html"], (req, res) => {
  res.render("contact", { title: "お問い合わせ", page: "contact", top: "お問い合わせ"});
});

app.get("/beforeBreak/", (req, res) => {
  res.redirect(301, "/beforeBreak")
})

app.get(["/beforeBreak", "/beforeBreak.html"], (req, res) => {
  res.render("beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get("/updates/", (req, res) => {
  res.redirect(301, "/updates")
})

app.get(["/updates", "/updates.html"], (req, res) => {
  res.render("updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

app.get("/snow/" (req, res) => {
  res
})

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
