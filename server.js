"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const historyPath = path.join(__dirname, 'chatHistory.json');

const chatHistory = [];

try {
  if (fs.existsSync(historyPath)) {
    const data = fs.readFileSync(historyPath, 'utf-8');
    chatHistory = JSON.parse(data);
  }
} catch (err) {
  console.error("チャット履歴の読み込みに失敗しました:", err);
}

io.on('connection', (socket) => {
  socket.emit('chat history', chatHistory);

  socket.on('chat message', (msg) => {
    const messageData = {
    username: socket.handshake.auth.username,
    message: msg,
    timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: "false" })
    };

  chatHistory.push(messageData);
  if (chatHistory.length > 100) {
    chatHistory.shift();
  }

  fs.writeFile(historyPath, JSON.stringify(chatHistory, null, 2), (err) => {
    if (err) console.error("履歴の保存エラー:", err);
  });

    io.emit('chat message', messageData);
  });
});

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

  const allUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const users = allUsers.users || {};
  
  const userData = users[username];
  if (!userData) {
    return render(req, res, 'login', { title: "ログイン", page: "login", top: "チャットにログイン", err: "存在しないユーザー名です。" });
  }

  const match = await bcrypt.compare(password, userData.passwordHash);
  if (match) {
    res.cookie('user', username);
    res.redirect('/chat');
    console.log("login is success")
  } else {
    render(req, res, 'login', { title: "ログイン", page: "login", top: "チャットにログイン", err: "パスワードが違います。" });
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
  
  console.log("make a account is success")
  
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

app.get("/chat", (req, res) => {
  if (!req.cookies.user) {
    return res.redirect("/login?f=chat");
  }
  const username = req.cookies.user || "匿名";
  render(req, res, "chat", { title: "チャット", page: "chat", top: "チャット", username: req.cookies.user, username});
});

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
http.listen(port, () => {
  console.log("App listening on port " + port);
});