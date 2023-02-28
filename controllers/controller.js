const {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchArticleComments,
  insertComment,
  updateArticle,
  fetchUsers,
  deleteComments,
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
  const { topic, sort_by, order } = req.query;

  fetchArticles(topic, sort_by, order)
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

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const idChecker = fetchArticlesById(article_id);
  const selectsComments = fetchArticleComments(article_id);

  Promise.all([idChecker, selectsComments])
    .then(([article, commentsById]) => {
      res.status(200).send({ commentsById });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(inc_votes, article_id)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

const deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComments(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticles,
  getArticlesById,
  getArticleComments,
  postComment,
  patchArticles,
  getUsers,
  deleteCommentsById,
};
