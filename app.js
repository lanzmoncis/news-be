const express = require("express");
const {
  getTopics,
  getArticles,
  getArticlesById,
  getArticleComments,
} = require("./controllers/controller");
const {
  serverError,
  notFoundError,
  customError,
} = require("./error-handling-middleware/error-handling-middleware");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.all("/*", notFoundError);
app.use(customError);
app.use(serverError);

module.exports = app;
