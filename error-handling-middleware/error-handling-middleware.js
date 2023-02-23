const notFoundError = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

const customError = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

const serverError = (err, req, res, next) => {
  if (err === 500) {
    res.status(500).send({ msg: "Something went wrong" });
  }
};

module.exports = { serverError, notFoundError, customError };
