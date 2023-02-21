\c nc_news_test

SELECT comments.* FROM comments WHERE comments.article_id = 1 ORDER BY created_at DESC;