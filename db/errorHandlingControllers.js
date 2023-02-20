exports.handle404Status = (error, request, response, next) => {
  response.status(404).send({ msg: "Not Found" });
};

exports.handle500Status = (error, request, response, next) => {
  response.status(500).send({ msg: "Server Error" });
};
