const articles = require("../db/data/test-data/articles");
const {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
} = require("../models/model");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticlesById(article_id)
    .then((articleById) => {
      res.status(200).send({ articleById });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticles, getArticlesById };
