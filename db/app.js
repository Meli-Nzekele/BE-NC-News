const express = require("express");
const { getTopics, getArticles } = require("./controllers");
const {
  handle404Status,
  handle500Status,
} = require("./errorHandlingControllers");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "server ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(handle404Status);

app.use(handle500Status);

module.exports = app;
