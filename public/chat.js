"use strict";

const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
socket.emit("join", username);

socket.on('chat history', (history) => {
  messages.innerHTML = '';
  history.forEach(msg => {
    appendMessage(msg);
  });
});

socket.on('chat message', (msg) => {
  appendMessage(msg);
});

form.addEventListener('submit', function(e) {
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

function appendMessage(msg) {
  const item = document.createElement('div');
  item.classList.add('message-item');
  item.innerHTML = `<strong>${escapeHtml(msg.username)}</strong> [${escapeHtml(msg.timestamp)}]: <br> ${escapeHtml(msg.message)}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
