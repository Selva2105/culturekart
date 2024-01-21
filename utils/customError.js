/**
 * CustomError class represents custom error objects for handling exceptions in the application.
 * @extends Error
 */
class CustomError extends Error {
  /**
   * Creates an instance of CustomError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    // Call the constructor of the parent class (Error) with the provided message
    super(message);

    // Set additional properties specific to CustomError
    this.statusCode = statusCode; // HTTP status code
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error"; // Status type (fail or error)
    this.isOperational = true; // Indicates whether the error is operational

    // Capture the stack trace for better error diagnostics
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
