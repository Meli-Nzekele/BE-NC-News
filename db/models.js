const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db.query(`SELECT * FROM articles;`).then((result) => {
    return result.rows;
  });
};
