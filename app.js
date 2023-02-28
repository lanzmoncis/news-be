const express = require("express");
const {
  getTopics,
  getArticles,
  getArticlesById,
  getArticleComments,
  postComment,
  patchArticles,
  getUsers,
  deleteCommentsById,
} = require("./controllers/controller");
const {
  serverError,
  notFoundError,
  customError,
  psqlError,
} = require("./error-handling-middleware/error-handling-middleware");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticles);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.all("/*", notFoundError);
app.use(psqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
