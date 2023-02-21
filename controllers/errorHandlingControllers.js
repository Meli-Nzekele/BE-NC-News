exports.handle404Status = (request, response) => {
  response.status(404).send({ msg: "path not found" });
};

exports.handlePSQL400Status = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "article not found") {
    response.status(404).send({ msg: "Not Found" });
  } else {
    next(error);
  }
};
