//creating a custome error response class which extends the Error object.
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

//exporrting the module
module.exports = ErrorResponse;
