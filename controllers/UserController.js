const User = require("../models/user_models/user");
const ErrorResponse = require("../utils/error_response");
const asyncHandler = require("../middlewares/async_handler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto"); //this is a builtin in express ,need not add

//@desc     Default admin route
//@route    GET /api/v1/user
//@access   public
exports.defUser = (req, res, next) => {
  res.status(200).json({ success: true, message: "Welcome to Social-Bee" });
};

// @desc      Register user
// @route     POST /api/v1/user/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //sending confirmation mail
  const message = `Welcome To ${process.env.FROM_NAME} family,

  We welcome you to our small family. We hope you and your Ngo can help us create a better world
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nononvallis. 
  Phasellus ac lorem in nibh accumsan ultricies et euismod tellus. Morbi blandit et quam et rhoncus. Pellentesque scelerisque nunc non mi feugiat tempus.
  This is your username and pssword. Let change the world together.

  Email:  ${email}
  Password:  ${password}

  Thank You,
  ${process.env.FROM_NAME}
  ${process.env.DUMMY_ADDRESS},
  ${process.env.DUMMY_CITY},
  ${process.env.DUMMY_STATE},
  Zip Code: ${process.env.DUMMY_ZIPCODE},
  Phone Number: ${process.env.DUMMY_PHONE_NUMBER}
  Locate Us: ${process.env.DUMMY_MAP_LOCATION}
  `;
  try {
    await sendEmail({
      email: email,
      subject: "Hi This is Jane Doe form Social Bee",
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Email could not be sent,Sorry", 500));
  }
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "ngoOwned",
    select: "ngoName ngoDescription ngoRegistrationNumber ngoFounded",
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken); //testing

  await user.save({ validateBeforeSave: false });

  // Create reset url  http
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email from SocialBee because you have requested the reset of a password. Copy paste the link in your broswer to reset your password: \n\n ${resetUrl}
  \n\n  Link will expire in next 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res
      .status(200)
      .json({ success: true, data: "Email has been sent.Please check" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent,Sorry", 500));
  }
});

// @desc     Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    // ,resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  //Let's set a new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Update User Profile Picture from the Default picture
// @route     PUT /api/v1/auth/updatedprofilepic
// @access    Private
exports.updateprofilepic = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    profilepic: req.body.profilepic,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//this is a custom function to avoid Repeatation
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: "This is the cookie token",
    UserToken: token,
  });
};

//
//
//
//
//
//

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select('+password');

//   // Check current password
//   if (!(await user.matchPassword(req.body.currentPassword))) {
//     return next(new ErrorResponse('Password is incorrect', 401));
//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });
