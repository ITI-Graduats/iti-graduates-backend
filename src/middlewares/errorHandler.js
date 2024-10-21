const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "CastError") {
    err.message = `Invalid ${err.path}: ${err.value}.`;
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    err.message = `Duplicate field value: ${value}. Please use another value!`;
    err.statusCode = 400;
    err.name = "DuplicateDBFields";
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err.message = `Invalid input data. ${errors.join(". ")}`;
    err.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Unauthorized, Invalid token";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired, Please login again";
    err.statusCode = 401;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (message.search(/refresh/gi) >= 0) res.clearCookie("refreshToken");
  res.status(statusCode).send({ error: message });
  next();
};

module.exports = errorHandler;
