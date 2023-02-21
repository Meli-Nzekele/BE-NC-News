const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/controllers");
const {
  handle404Status,
  handlePSQL400Status,
  handleCustomErrors,
} = require("./controllers/errorHandlingControllers");
const app = express();

app.get("/api", (request, response) => {
  response.status(200).send({ message: "server ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use(handle404Status);

app.use(handlePSQL400Status);

app.use(handleCustomErrors);

module.exports = app;
