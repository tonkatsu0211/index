"use strict";
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));

app.get(["/", "/index", "/index/", "/top", "/top/"], (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get(["/my", "/my/"], (req, res) => {
  res.sendFile(path.join(__dirname, "my.html"));
});

app.get(["/projects", "/projects/"], (req, res) => {
  res.sendFile(path.join(__dirname, "projects.html"));
});

app.get(["/constructing", "/constructing/"], (req, res) => {
  res.sendFile(path.join(__dirname, "constructing.html"));
});

app.get(["/constructing1", "/constructing1/"], (req, res) => {
  res.sendFile(path.join(__dirname, "constructing1.html"));
});

app.get(["/contact", "/contact/"], (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

app.get(["/beforeBreak", "/beforeBreak/"], (req, res) => {
  res.sendFile(path.join(__dirname, "beforeBreak.html"));
});

app.get(["/breakHistory", "/breakHistory/"], (req, res) => {
  res.sendFile(path.join(__dirname, "breakHistory.html"));
});

app.get(["/error", "/error/"], (req, res) => {
  res.sendFile(path.join(__dirname, "error.html"));
});

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  console.log("Fallback 404 for:", req.path);
  res.status(404).redirect(`/error.html?e=${encodeURIComponent(pageName)}`);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("App listening on port " + listener.address().port);
});
