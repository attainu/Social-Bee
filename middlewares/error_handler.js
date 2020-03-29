//importing the error response module
const ErrorResponse = require("../utils/error_response");
const errorHandler = (err, req, res, next) => {
  //console logging the error for the developer only
  console.log(err);
  console.log(err.stack.red);

  let error = { ...err };
  error.message = err.message;

  //checking for badly formated object id
  if (err.name === "CastError") {
    const message = `Document or Record not found with id:${err.value}. Wrong ID formate`;
    error = new ErrorResponse(message, 404);
  }

  //checking for duplicate values
  if (err.code === 11000) {
    const message = "Duplicate value found in database";
    error = new ErrorResponse(message, 400);
  }

  //checking for all validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

//exporting the module
module.exports = errorHandler;
