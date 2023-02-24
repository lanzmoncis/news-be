const db = require("../db/connection");

const fetchTopics = () => {
  const queryString = `SELECT * FROM topics;`;

  return db.query(queryString).then((topics) => {
    return topics.rows;
  });
};

const fetchArticles = () => {
  const queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(queryString).then((articles) => {
    return articles.rows;
  });
};

const fetchArticlesById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `SELECT * FROM articles WHERE article_id = $1`;
  const value = [article_id];

  return db.query(queryString, value).then((articleById) => {
    if (articleById.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return articleById.rows[0];
  });
};

const fetchArticleComments = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;`;
  const value = [article_id];

  return db.query(queryString, value).then((commentsById) => {
    return commentsById.rows;
  });
};

const insertComment = (username, body, article_id) => {
  const queryString = `INSERT INTO comments (author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *;`;

  const value = [username, body, article_id];

  return db.query(queryString, value).then((comment) => {
    return comment.rows[0];
  });
};

const updateArticle = (inc_votes, article_id) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
`;

  const value = [inc_votes, article_id];

  return db.query(queryString, value).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return result.rows[0];
  });
};

const fetchUsers = () => {
  const queryString = `SELECT * FROM users`;

  return db
    .query(queryString)
    .then((users) => {
      return users.rows;
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchArticleComments,
  insertComment,
  updateArticle,
  fetchUsers,
};
