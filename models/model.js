const db = require("../db/connection");

const fetchTopics = () => {
  const queryString = `SELECT * FROM topics;`;

  return db.query(queryString).then((topics) => {
    return topics.rows;
  });
};

module.exports = fetchTopics;
