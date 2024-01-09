const CustomError = require("../utils/customError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const produtionError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went worng please try again later",
    });
  }
};

// 3. Function to handle duplicate key error
const duplicateKeyErrorHandler = (err) => {
  let msg;

  if (err.keyValue.userName) {
    msg = `There is already a product with name : ${err.keyValue.userName} exists.`;
  }
  if (err.keyValue.email) {
    msg = `There is already a user with email ${err.keyValue.email} exists.`;
  }

  return new CustomError(msg, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {

    // => If any duplicate key is find handle it here
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    produtionError(res, error);
  }
};
