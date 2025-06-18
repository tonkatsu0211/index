"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const usersData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const historyPath = path.join(__dirname, 'chatHistory.json');
const { v4: uuidv4 } = require('uuid');
const adminUsers = new Set();
for (const [username, info] of Object.entries(usersData.users)) {
  if (info.isAdmin === "true") {
    adminUsers.add(username);
  }
};

let chatHistory = [];

try {
  const data = fs.readFileSync(historyPath, 'utf-8')
  chatHistory = JSON.parse(data)
} catch (err) {
  console.error("チャット履歴の読み込みに失敗しました:", err);
}

io.on('connection', (socket) => {
  const username = socket.handshake.auth.username;
  console.log("username:", username);

  socket.data.username = username;
  socket.data.isAdmin = adminUsers.has(username);

  socket.emit('chat history', chatHistory);
  
    socket.on('chat message', (msg) => {
    console.log("message from: ", socket.data.username, ", message: ", msg);
    
    if (msg.trim() === '/delete' && adminUsers.has(username)) {
      chatHistory = [];
      io.emit('chat history', chatHistory);
      return;
    }
    
    if (msg.startsWith('/admin ')) {
      const targetUser = msg.slice(7).trim();
      if (socket.data.isAdmin) {
        adminUsers.add(targetUser);
        io.emit('system message', `${targetUser} さんに管理者権限が付与されました`);
      } else {
        socket.emit('system message', `あなたには管理者権限がありません`);
      }
      return;
    }

    const messageData = {
      id: uuidv4(),
      username: socket.data.username,
      message: msg,
      timestamp: new Date().toLocaleString('ja-JP', { hour12: false }),
    };
    
    console.log("messageData: ", messageData);
    chatHistory.push(messageData);
    if (chatHistory.length > 100) chatHistory.shift();
    console.log("chatHistory: ", chatHistory);
    fs.writeFile(path.join(__dirname, "chatHistory.json"), JSON.stringify(chatHistory, null, 2), (err) => {
      if (err) {
        console.error("cannot saved chatHistory");
      } else {
        console.log("saved chatHistory");
      }
    });
    io.emit('chat history', chatHistory)
    io.emit('chat update', chatHistory);
  });
  
  socket.on('delete message', (id) => {
  const username = socket.handshake.auth.username;
  const isAdmin = adminUsers.has(username);

  const index = chatHistory.findIndex(msg => msg.id === id);
  if (index !== -1) {
    const message = chatHistory[index];
    if (message.username === username || isAdmin) {
      chatHistory.splice(index, 1);
      io.emit('chat history', chatHistory);
    }
  }
});
});

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
  const users = usersData.users;
  
  if (!users[username]) {
    return render(req, res, "login", { title: "ログイン", page: "login", top: "チャットにログイン", err: 'ユーザー名が存在しません'});
  }
  
  const match = await bcrypt.compare(password, users[username].passwordHash);
  
  if (match) {
    res.cookie('user', username, { httpOnly: false, path: "/" });
    res.cookie('isAdmin', usersData.users[username].isAdmin === "true" ? 'true' : 'false', { httpOnly: false, path: "/" });
    console.log('Login:', username, 'isAdmin:', usersData.users[username].isAdmin);
    console.log("login success")
    return res.redirect('/chat');
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
  const isAdmin = "false";
  users[username] = { passwordHash, isAdmin };
  
  const usersData = users
  
  fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("cannot signed up");
    } else {
      console.log("saved user data: ", users);
    }
  });
  
  
  fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify({newUser: {passwordHash: '...'}}, null, 2), (err) => {
    if (err) {
      console.error("errorrrrrrrrrrrr!!!!!  lol");
    }
  });
  
  console.log("signup is success")
  
  res.cookie('user', username, { httpOnly: false, path: "/" });
  res.cookie('isAdmin', "false", { httpOnly: false, path: "/" })
  res.redirect('/chat');
  console.log("login is success")
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