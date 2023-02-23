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
        return Promise.reject("Article Not Found");
      }
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
      if (result.rowCount === 0) {
        return Promise.reject("Comment Not Found");
      }
      return result.rows;
    });
};

exports.addComment = (article_id, newComment) => {
  const { body, username } = newComment;

  if (body.length === 0) {
    return Promise.reject("Invalid Comment Format");
  }
  if (username.length === 0) {
    return Promise.reject("Author Not Found");
  }

  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateVotes = (article_id, votes) => {
  if (!votes.inc_votes === undefined || Object.keys(votes).length === 0) {
    return Promise.reject("Bad Request");
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes.inc_votes, article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Not Found");
      }
      return result.rows[0];
    });
};
