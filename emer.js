"use strict";
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pcViews'));

app.get("*", (req, res) => {
  console.log("access in Emergency");
  res.render("emer", { title: "_tonkatsu_のページ", page: "emer", top: "メンテナンス中"});
});

const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
  console.log("App listening on port " + listener.address().port);
});
