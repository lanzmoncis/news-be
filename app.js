const express = require("express");
const getTopics = require("./controllers/controller");
const error500 = require("./error-handling-middleware/error-handling-middleware");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.get("/api/topics", getTopics);

app.use(error500);

module.exports = app;
