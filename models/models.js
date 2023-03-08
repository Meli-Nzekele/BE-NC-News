const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Topic Not Found");
    }
    return result.rows;
  });
};

exports.fetchTopicByName = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject("Topic Not found");
      }
      return result.rows[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order_by = "DESC") => {
  const validSortByOptions = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_id",
    "votes",
    "comment_count",
  ];

  const validOrderByOptions = ["ASC", "DESC", "asc", "desc"];

  if (
    !validSortByOptions.includes(sort_by) ||
    !validOrderByOptions.includes(order_by)
  ) {
    return Promise.reject("Bad Request");
  }

  let queryString = `SELECT articles.*, COUNT(comments.comment_id) :: INT AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;

  return db.query(queryString, queryParams).then((result) => {
    if (result.rows === undefined) {
      return Promise.reject("Not Found");
    } else if (result.rows.length === 0) {
      return "Article Not Found";
    }
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*,  COUNT(comments.comment_id) :: INT AS comment_count
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Article Not Found");
      }
      return result.rows[0];
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
  if (votes.inc_votes === undefined || Object.keys(votes).length === 0) {
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

exports.fetchUsers = () => {
  return db.query(`SELECT users.* FROM users;`).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("Not Found");
    }
    return result.rows;
  });
};

exports.fetchUsersByUsername = (username) => {
  return db
    .query(`SELECT * FROM USERS WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Not Found");
      }
      return result.rows[0];
    });
};

exports.updateCommentVotes = (comment_id, votes) => {
  if (
    !votes ||
    votes.inc_votes === undefined ||
    Object.keys(votes).length === 0
  ) {
    return Promise.reject("Bad Request");
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [votes.inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Not Found");
      }
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Comment Not Found");
      }
      return result.rows[0];
    });
};
