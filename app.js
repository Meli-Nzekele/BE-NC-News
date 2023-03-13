const express = require("express");
const app = express();
const cors = require("cors");

const {
  getTopics,
  getArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  postComment,
  getUsers,
  getUsersByUsername,
  patchCommentById,
  deleteCommentById,
} = require("./controllers/controllers");

const {
  handle404Status,
  handlePSQL400Status,
  handleCustom400Errors,
  handleCustom404Errors,
} = require("./controllers/errorHandlingControllers");

app.use(cors());

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ message: "server ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsersByUsername);

app.patch("/api/comments/:comment_id", patchCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handle404Status);

app.use(handlePSQL400Status);

app.use(handleCustom400Errors);

app.use(handleCustom404Errors);

module.exports = app;
