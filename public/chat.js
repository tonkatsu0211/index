"use strict";
const io = require("io")
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

io.on('connection', (socket) => {
  const username = socket.handshake.auth.username || '匿名';

  socket.on('chat message', (msg) => {
    const messageData = {
      username: username,
      message: msg,
      timestamp: new Date().toLocaleString()
    };
    io.emit('chat message', messageData);
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const message = input.value.trim();

  if (message.length > 100) {
    alert("メッセージは100文字以内で入力してください。");
    return;
  }

  if (message) {
    socket.emit('chat message', message);
    input.value = '';
  }
});
