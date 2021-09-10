const express = require("express");
const path = require("path");
const app = express();
const AWS = require("aws-sdk");
var s3 = new AWS.S3();

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set("x-timestamp", Date.now());
  res.set("x-powered-by", "cyclic.sh");
  console.log(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`
  );
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
  index: ["index.html"],
  maxAge: "1m",
  redirect: false,
};
app.use(express.static("public", options));

// #############################################################################
// Catch all handler for all other request.
app.use("*", (req, res) => {
  console.log(process.env);
  listBuckets().then((d) => {
    res
      .json({
        at: new Date().toISOString(),
        method: req.method,
        hostname: req.hostname,
        ip: req.ip,
        query: req.query,
        headers: req.headers,
        cookies: req.cookies,
        params: req.params,
        env: process.env,
      })
      .end();
  });
});

const listBuckets = () => {
  return new Promise((res, rej) => {
    var params = {};
    s3.listBuckets(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log(data); // successful response
        res(data);
      }
    });
  });
};

module.exports = app;
