const CustomError = require("../utils/customError");

/**
 * Handle development environment errors.
 *
 * @param {Object} res - Express response object.
 * @param {Object} error - CustomError object.
 */
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

/**
 * Handle production environment errors.
 *
 * @param {Object} res - Express response object.
 * @param {Object} error - CustomError object.
 */
const produtionError = (res, error) => {
  if (error.isOperational) {
    // If it's an operational error, send a specific error message
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    // If it's not an operational error, send a generic error message
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Handle duplicate key error and convert it into a CustomError.
 *
 * @param {Object} err - MongoDB duplicate key error.
 * @returns {CustomError} - CustomError object with a specific error message.
 */
const duplicateKeyErrorHandler = (err) => {
  let msg;

  if (err.keyValue.userName) {
    msg = `There is already a product with name: ${err.keyValue.userName} exists.`;
  } else if (err.keyValue.email) {
    msg = `There is already a user with email ${err.keyValue.email} exists.`;
  } else if (err.keyValue.hasOwnProperty("phoneNumber.Number")) {
    msg = `There is already a user with Phone number ${err.keyValue["phoneNumber.Number"]} exists.`;
  } else {
    // Handle the case where err.keyValue is undefined
    msg = "Duplicate key error, but specific field is missing.";
  }

  return new CustomError(msg, 400);
};

/**
 * Handle validation errors and convert them into a CustomError.
 *
 * @param {Object} err - MongoDB validation error.
 * @returns {CustomError} - CustomError object with a specific error message.
 */
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map(val => {
    return {
      message: val.message,
      value: val.value
    };
  });

  const errorMessages = errors.map(error => `${error.message} ( ${error.value} )`).join(", ");
  const msg = `Invalid input data: ${errorMessages}`;
  return new CustomError(msg, 400);
};

/**
 * Express error handler middleware.
 *
 * @param {Object} error - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports = (error, req, res, next) => {
  // Set default status code and status if not provided
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    // Handle errors in development environment
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    // Handle errors in production environment

    // If any duplicate key is found, handle it here
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    // If it's a validation error, handle it here
    if (error.name === "ValidationError") error = validationErrorHandler(error);

    produtionError(res, error);
  }
};
