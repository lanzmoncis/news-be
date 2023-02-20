const express = require("express");
const getTopics = require("./controllers/controller");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ err });
});

module.exports = app;
