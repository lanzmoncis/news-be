const error500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Something went wrong" });
};

module.exports = error500;
