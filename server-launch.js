const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const http = require("http");

const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(express.json());
app.use(fileUpload());

app.post("/", async (req, res) => {
  try {
    if (req.body.apiKey !== apiKey) throw "no";

    console.log(req.files);
    res.sendStatus(200);
  } catch (err) {
    console.log("Error", err);
    res.sendStatus(500);
  }
});

const server = http.createServer(app);

server.listen(port, () =>
  console.log("Deployment server running on port ", port)
);
