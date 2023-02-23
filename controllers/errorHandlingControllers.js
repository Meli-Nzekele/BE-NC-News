exports.handle404Status = (request, response) => {
  response.status(404).send({ msg: "Path Not Found" });
};

exports.handlePSQL400Status = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(400).send({ msg: "Article Does Not Exist" });
  } else if (error === "Invalid Comment Format") {
    response.status(400).send({ msg: "Invalid Comment Format" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "Article Not Found") {
    response.status(404).send({ msg: "Article Not Found" });
  } else if (error === "Comment Not Found") {
    response.status(404).send({ msg: "Comment Not Found" });
  } else if (error === "Author Not Found") {
    response.status(404).send({ msg: "Author Not Found" });
  } else {
    console.log(error);
    response.status(500).send({ msg: "Internal Server Error" });
  }
};
