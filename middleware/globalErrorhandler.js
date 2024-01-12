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

  console.log("Error ", err);

  if (err.keyValue.userName) {
    msg = `There is already a product with name: ${err.keyValue.userName} exists.`;
  } else if (err.keyValue.email) {
    msg = `There is already a user with email ${err.keyValue.email} exists.`;
  } else if (err.keyValue.hasOwnProperty("phoneNumber.Number")) {
    msg = `There is already a user with Phone number ${err.keyValue["phoneNumber.Number"]} exists.`;
  } else {
    // Handle the case where err.keyValue.phoneNumber is undefined
    msg = "Duplicate key error, but specific field is missing.";
  }

  return new CustomError(msg, 400);
};

// 4. Function to handle validation errors
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


module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {

    // => If any duplicate key is find handle it here
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    if (error.name === "ValidationError") error = validationErrorHandler(error);

    produtionError(res, error);
  }
};
