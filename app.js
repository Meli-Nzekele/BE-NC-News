const express = require("express");
const {
  getTopics,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/controllers");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ message: "server ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
