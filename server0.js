"use strict";
const express = require("express");
const app = express();

app.use((req, res) => {
  const pageName = req.path.replace("/", "");
  res.redirect('https://padlet.com/tonkatsu0211/tonkatsu_reception')
});

const listener = app.listen(process.env.PORT, () => {
  console.log("App listening on port " + listener.address().port);
});
