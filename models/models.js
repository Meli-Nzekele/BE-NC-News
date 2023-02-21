const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db.query(`SELECT * FROM articles;`).then((result) => {
    // SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id;
    return result.rows;
  });
};

// exports.fetchTreasures = (order_by) => {
//   let queryStr = `SELECT treasure_id,
//  treasure_name,
//  colour,
//  age,
//  cost_at_auction,
//  shop_name FROM treasures JOIN shops ON treasures.shop_id = shops.shop_id`;
//   if (order_by) {
//     queryStr += ` ORDER BY ${order_by} ASC;`;
//   }
//   return db.query(queryStr).then((result) => {
//     return result.rows;
//   });
// };
