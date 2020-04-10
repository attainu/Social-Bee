//imoprting the packages
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async_handler");
const ErrorResponse = require("../utils/error_response");
//importing the admin model schemas
const Employee = require("../models/admin_models/emp");

// route protection function
exports.AdminAuthProtect = asyncHandler(async (req, res, next) => {
  let authToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.authToken) {
    authToken = req.coookies.authToken;
  }

  //Making sure Token exists
  if (!authToken) {
    return next(new ErrorResponse("Unauthorized Employee ACCESS DENIED!", 401));
  }
  try {
    //Verify token from palyload inside token,
    const token = jwt.verify(authToken, process.env.JWT_KEY);

    console.log(token);

    //req.user will have the details of a employee which shall be utilized by suceeding route-handler
    req.user = await Employee.findById(token.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Unauthorized Employee ACCESS DENIED!", 401));
  }
});
