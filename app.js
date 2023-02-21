const express = require("express");
const { getTopics, getArticles } = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "server ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
