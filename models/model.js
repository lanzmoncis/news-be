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

module.exports = { fetchTopics, fetchArticles };
