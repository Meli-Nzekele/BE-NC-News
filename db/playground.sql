\c nc_news_test

SELECT * FROM articles;
SELECT * FROM topics;
SELECT * FROM comments;
SELECT * FROM users;

SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
