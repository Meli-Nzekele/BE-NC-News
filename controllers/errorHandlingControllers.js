exports.handle404Status = (request, response) => {
  response.status(404).send({ msg: "Path Not Found" });
};

exports.handlePSQL400Status = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

exports.handleCustom400Errors = (error, request, response, next) => {
  if (error === "Invalid Comment Format") {
    response.status(400).send({ msg: "Invalid Comment Format" });
  } else if (error === "Invalid Format") {
    response.status(400).send({ msg: "Invalid Format" });
  } else if (error === "Bad Request") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

exports.handleCustom404Errors = (error, request, response, next) => {
  if (error === "Article Not Found") {
    response.status(404).send({ msg: "Article Not Found" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Article ID Does Not Exist" });
  } else if (error === "Comment Not Found") {
    response.status(404).send({ msg: "Comment Not Found" });
  } else if (error === "Author Not Found") {
    response.status(404).send({ msg: "Author Not Found" });
  } else if (error === "Not Found") {
    response.status(404).send({ msg: "Not Found" });
  } else if (error === "Topic Not found") {
    response.status(404).send({ msg: "Topic Not found" });
  }
};

exports.handleServerErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Internal Server Error" });
};
