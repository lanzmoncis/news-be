const notFoundError = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

const serverError = (err, req, res, next) => {
  if (err === 500) {
    res.status(500).send({ msg: "Something went wrong" });
  }
};

module.exports = { serverError, notFoundError };
