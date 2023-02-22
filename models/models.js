const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT articles.* FROM articles WHERE articles.article_id = $1;`, [
      article_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("article not found");
      }
      return result.rows;
    });
};

exports.addComment = (article_id, newComment) => {
  const { commentArticleId } = article_id;

  const { body, author, id, votes = 0, created_at } = newComment;
  console.log(newComment);

  return db
    .query(
      `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [body, author, commentArticleId, votes, created_at]
    )
    .then((result) => {
      return result.rows;
    });
};
