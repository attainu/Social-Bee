//creating a wrapper to wrap all the async functions so do not have to repeate the try catch block in the controller files to follow the DRY pattern

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//exporting the ayncHandler module
module.exports = asyncHandler;
