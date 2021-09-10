const express = require("express");
const app = express();
app.get("/", (req, res) => {
  //   console.log(process.env);
  res.json({ Hello: "😀" });
});
module.exports = app;
