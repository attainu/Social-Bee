const jwt = require('jsonwebtoken');
const asyncHandler = require('./async_handler');
const ErrorResponse = require('../utils/error_response');
const User = require('../models/user_models/User');

//Protect Routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  //converting the bearer-token to an array and checking
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.coookies.token;
  }

  //Making sure Token exists
  if (!token) {
    return next(new ErrorResponse('Not Authorised to Access this Route!', 401));
  }

  try {
    //Verify token from palyload inside token,
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    console.log(decodedToken);

    //req.user will have the details of a user which shall be utilized by suceeding route-handler
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not Authorised to Access this Route!', 401));
  }
});

//The below function is to check the role -->user and ngoRep and decide accordingly,if he should
//be given access to a particular route

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
