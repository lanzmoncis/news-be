// const db = require("../db/connection");

// const fetchTopics = () => {
//   const queryString = `SELECT * FROM topics;`;

//   return db.query(queryString).then((topics) => {
//     return topics.rows;
//   });
// };

// const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
//   const validSortColumns = [
//     "article_id",
//     "title",
//     "topic",
//     "author",
//     "body",
//     "created_at",
//     "votes",
//     "article_img_url",
//   ];

//   const validOrderOptions = ["asc", "desc"];

//   if (!validSortColumns.includes(sort_by.toLowerCase())) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }

//   if (!validOrderOptions.includes(order.toLowerCase())) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }

//   const value = [];

//   let queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//                       FROM articles
//                       LEFT JOIN comments ON articles.article_id = comments.article_id`;
//   if (topic) {
//     value.push(topic);
//     queryString += ` WHERE articles.topic = $1`;
//   }
//   queryString += ` GROUP BY articles.article_id
//                      ORDER BY ${sort_by} ${order}`;

//   return db.query(queryString, value).then((articles) => {
//     if (articles.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Not Found" });
//     }
//     return articles.rows;
//   });

//   // const queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//   // FROM articles
//   // LEFT JOIN comments ON articles.article_id = comments.article_id
//   // GROUP BY articles.article_id
//   // ORDER BY articles.created_at DESC;`;
//   // return db.query(queryString).then((articles) => {
//   //   return articles.rows;
//   // });
// };

// const fetchArticlesById = (article_id) => {
//   if (isNaN(article_id)) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }

//   // const queryString = `SELECT * FROM articles WHERE article_id = $1`;

//   const queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//   FROM articles
//   LEFT JOIN comments ON articles.article_id = comments.article_id
//   WHERE articles.article_id = $1
//   GROUP BY articles.article_id`;

//   const value = [article_id];

//   return db.query(queryString, value).then((articleById) => {
//     if (articleById.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Not Found" });
//     }
//     return articleById.rows[0];
//   });
// };

// const fetchArticleComments = (article_id) => {
//   if (isNaN(article_id)) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }

//   const queryString = `SELECT comment_id, votes, created_at, author, body, article_id
//   FROM comments
//   WHERE article_id = $1
//   ORDER BY created_at DESC;`;
//   const value = [article_id];

//   return db.query(queryString, value).then((commentsById) => {
//     return commentsById.rows;
//   });
// };

// const insertComment = (username, body, article_id) => {
//   const queryString = `INSERT INTO comments (author, body, article_id)
//   VALUES ($1, $2, $3)
//   RETURNING *;`;

//   const value = [username, body, article_id];

//   return db.query(queryString, value).then((comment) => {
//     return comment.rows[0];
//   });
// };

// const updateArticle = (inc_votes, article_id) => {
//   if (isNaN(inc_votes)) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }
//   const queryString = `
//   UPDATE articles
//   SET votes = votes + $1
//   WHERE article_id = $2
//   RETURNING *;
// `;

//   const value = [inc_votes, article_id];

//   return db.query(queryString, value).then((result) => {
//     if (result.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Not Found" });
//     }
//     return result.rows[0];
//   });
// };

// const fetchUsers = () => {
//   const queryString = `SELECT * FROM users`;

//   return db
//     .query(queryString)
//     .then((users) => {
//       return users.rows;
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

// const deleteComments = (comment_id) => {
//   if (isNaN(comment_id)) {
//     return Promise.reject({ status: 400, msg: "Bad Request" });
//   }
//   const value = [comment_id];
//   const queryString = `DELETE FROM comments WHERE comment_id = $1`;

//   return db
//     .query(`SELECT * FROM comments WHERE comment_id = $1`, value)
//     .then((result) => {
//       if (result.rows.length === 0) {
//         return Promise.reject({ status: 404, msg: "Not Found" });
//       } else {
//         return db.query(queryString, value);
//       }
//     });
// };

// module.exports = {
//   fetchTopics,
//   fetchArticles,
//   fetchArticlesById,
//   fetchArticleComments,
//   insertComment,
//   updateArticle,
//   fetchUsers,
//   deleteComments,
// };

const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => topics.rows);
};

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url", // fixed name
  ];

  const validOrderOptions = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validOrderOptions.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const values = [];
  let queryString = `
    SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    values.push(topic);
    queryString += ` WHERE articles.topic = $1`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, values).then((articles) => {
    if (articles.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return articles.rows;
  });
};

const fetchArticlesById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `
    SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  return db.query(queryString, [article_id]).then((articleById) => {
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

  const queryString = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;

  return db.query(queryString, [article_id]).then((comments) => comments.rows);
};

const insertComment = (username, body, article_id) => {
  const queryString = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return db
    .query(queryString, [username, body, article_id])
    .then((res) => res.rows[0]);
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

  return db.query(queryString, [inc_votes, article_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return res.rows[0];
  });
};

const fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => users.rows);
};

const deleteComments = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(queryString, [comment_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return res.rows[0];
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
  deleteComments,
};
