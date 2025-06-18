"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

users['newUser'] = { passwordHash: '...' };
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'tonkatsu-0211',
  resave: false,
  saveUninitialized: false
}));

app.use(cookieParser());

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pcViews'));

app.use(express.json());

app.post('/log', (req, res) => {
  console.log(req.body.message);
  res.json({ status: 'ok' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const user = users[username];

  if (!user) {
    return render(req, res, 'login', { title: "ログイン", page: "login", top: "チャットにログイン", err: "ユーザー名またはパスワードが違います。" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    res.cookie('user', username);
    res.redirect('/empass');
  } else {
    render(req, res, 'login', { title: "ログイン", page: "login", top: "チャットにログイン", err: "ユーザー名またはパスワードが違います。" });
  }
});

app.post('/signup', async (req, res) => {
  const allUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const users = allUsers.users || {};

  const { username, password } = req.body;

  if (users[username]) {
    return render(req, res, 'signup', { title: "サインアップ", page: "signup", top: "サインアップ", err: "既に存在するユーザー名です" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users[username] = { passwordHash };

  fs.writeFileSync('users.json', JSON.stringify({ users }, null, 2));
  
  console.log("make a account success")
  
  req.session.user = username;
  res.redirect('/chat');
});

function render(req, res, view, data = {}, locate = "") {
  const qE = req.query.e || "";
  if (view == "error" && qE) {
    console.log(`redirect by 404 to /error?e=${qE}`);
  }
  const name = locate ? `${locate}/${view}` : view;
  res.render(name, { ...data, em: "false"}, (err, html) => {
    if (err) {
      console.log(`404 at /${name}`);
      res.status(404).render('error', {
        title: "404 Not Found",
        page: "error",
        ec: view, 
        em: "false"
      });
    } else {
      console.log(`access to /${name} ... OK`);
      res.send(html);
    }
  });
}

app.get(["/", "/index", "/top", "/index.html"], (req, res) => {
  const from = req.query.f || "";
  render(req, res, "index", { from, title: "_tonkatsu_のページ", page: "index", top: "_tonkatsu_ / tonkatsu0211のページにようこそ!!"});
});

app.get(["/my", "/my.html"], (req, res) => {
  render(req, res, "my", { title: "自己紹介(事故紹介)", page: "my", top: "自己紹介(事故紹介)"});
});

app.get(["/projects", "/projects.html"], (req, res) => {
  render(req, res, "projects", { title: "作品", page: "projects", top: "Scratchの作品"});
});

app.get(["/constructing", "/const", "/constructing.html"], (req, res) => {
  render(req, res, "constructing", { title: "建設中のページ", page: "constructing", top: "建設中"});
});

app.get(["/constructing1", "/const1", "/constructing1.html"], (req, res) => {
  render(req, res, "constructing1", { title: "建設中のページ", page: "constructing1", top: "建設中"});
});

app.get(["/contact", "/contact.html"], (req, res) => {
  render(req, res, "contact", { title: "お問い合わせ", page: "contact", top: "お問い合わせ"});
});

app.get(["/beforeBreak", "/beforeBreak.html"], (req, res) => {
  render(req, res, "beforeBreak", { title: "_tonkatsu_のページ", page: "beforeBreak", top: "履歴破壊"});
});

app.get(["/updates", "/updates.html"], (req, res) => {
  render(req, res, "updates", { title: "ページ更新履歴", page: "updates", top: "ページ更新履歴"});
});

app.get(["/games", "/games.html"], (req, res) => {
  render(req, res, "games", { title: "_tonkatsu_のページ", page: "games", top: "ゲームをプレイ"});
});

//app.get(["/login", "/login.html"], (req, res) => {
  //render(req, res, "constructing", { title: "建設中のページ", page: "constructing", top: "建設中"});
//});

app.get(["/login", "/login.html"], (req, res) => {
  render(req, res, "login", { title: "ログイン", page: "login", top: "チャットにログイン", err: "none"});
});

app.get(["/signup", "/signup.html"], (req, res) => {
  render(req, res, "signup", { title: "サインアップ", page: "signup", top: "サインアップ", err: "none"});
});

app.get(["/games/:id", "/games/:id.html"], (req, res) => {
  let gameId = req.params.id;
  gameId = gameId.replace(/\.(html|ejs)$/, "");
  render(req, res, gameId, {}, "games");
});

app.get(["/error", "/error.html"], (req, res) => {
  render(req, res, "error", { title: "404 Not Found", page: "error", ec: "none"});
});

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  console.log(`404 at /${pageName}`)
  res.status(404).render('error', { title: "404 Not Found", page: "error", ec: pageName, em: "false"});
});

const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
  console.log("App listening on port " + listener.address().port);
});
