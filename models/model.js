const db = require("../db/connection");

const fetchTopics = () => {
  const queryString = `SELECT * FROM topics;`;
  return db.query(queryString).then((results) => {
    return results.rows;
  });
};

module.exports = fetchTopics;
