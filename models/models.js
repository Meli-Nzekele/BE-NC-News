const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.* FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
