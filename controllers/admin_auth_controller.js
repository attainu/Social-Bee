//importing the rrquired pacakages
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//importing utilites
const ErrorResponse = require("../utils/error_response");
const sendEmail = require("../utils/sendEmail");

//importing the asyncHandler module
const asyncHandler = require("../middlewares/async_handler");

//importing the admin model schemas
const Employee = require("../models/admin_models/emp");

//declaring an empty object to store and export the methods
var empAuthController = {};

//defining the functions

//@desc     Default admin route
//@route    GET /api/v1/admin
//@access   public
empAuthController.defAuthAdmin = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Sign Up or Login to Access Admin Pannel",
  });
};

//@desc     Admin regisration/signup route
//@route    POST /api/v1/admin/signup
//@access   public
empAuthController.signup = asyncHandler(async (req, res, next) => {
  let { emp_email, emp_password } = req.body;
  //sending confirmation mail
  const message = `Welcome To ${process.env.FROM_NAME} family,

  We welcome you to our small team and hope you have a long working relationship with us. 
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nononvallis. 
  Phasellus ac lorem in nibh accumsan ultricies et euismod tellus. Morbi blandit et quam et rhoncus. Pellentesque scelerisque nunc non mi feugiat tempus.
  You are a part of our company now and this is your official Email and password. You will need this to login into our admin platform to perform your duties keep them safe. Good Luck.

  Email:  ${emp_email}
  Password:  ${emp_password}

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
      email: emp_email,
      subject: "Hi This is Jhon Doe form Social Bee",
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Email could not be sent,Sorry", 500));
  }

  let empData = new Employee(req.body);
  await empData.save();

  res.status(201).json({
    success: "Employee Signed Up",
    data: "Confirmations mail sent",
    New_Employee_Data: empData,
  });
});

//@desc     Admin Login route
//@route    POST /api/v1/admin/login
//@access   public
empAuthController.login = asyncHandler(async (req, res, next) => {
  const { emp_email, emp_password } = req.body;

  //validating the email and password
  if (!emp_email || !emp_password) {
    return next(
      new ErrorResponse(
        "Wrong email and Password or Email and password fileds are empty. Please check",
        400
      )
    );
  }
  //checking if the employee data is present
  const empData = await Employee.findOne({ emp_email }).select("+emp_password");

  if (!empData) {
    return next(new ErrorResponse("Employee not registered", 401));
  }
  //checking for password match
  const match = await empData.matchPassword(emp_password);
  if (!match) {
    return next(new ErrorResponse("Password mismatch", 401));
  }
  //create token
  sendToken(empData, 200, res);
});

//@desc     Admin Logout /clear cookie
//@route    GET /api/v1/admin/logout
//@access   private
empAuthController.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc     Employee Forgot password
//@route    POST /api/v1/admin/forgotpassword
//@access   public
empAuthController.ForgotPassword = asyncHandler(async (req, res, next) => {
  const { emp_email } = req.body;
  const emp = await Employee.findOne({ emp_email });

  if (!emp) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with email:${req.body.email}. Check Email`,
        404
      )
    );
  }
  //get reset token
  const resetToken = emp.getResetToken();
  await emp.save({ validateBeforeSave: false });
  //creating reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/admin/resetpassword/${resetToken}`;

  const message = `You are receiving this email from SocialBee because you have requested the reset of a password. Copy paste the link in your broswer to reset your password: \n\n ${resetUrl}
  \n\n  Link will expire in next 10 minutes`;
  try {
    await sendEmail({
      email: emp_email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email has been sent.Please check",
      data: emp,
    });
  } catch (err) {
    console.log(err);
    emp.resetPasswordToken = undefined;
    emp.resetPasswordExpire = undefined;

    await emp.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent,Sorry", 500));
  }
});

//@desc     Reset password
//@route    PUT /api/v1/admin/resetpassword/:resetToken
//@access   public
empAuthController.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await Employee.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  //Let's set a new password
  user.emp_password = req.body.emp_password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

//custom function to get the jwt token and create a cookie and send response
const sendToken = (empData, statusCode, res) => {
  const token = empData.getJwtToken();
  const options = {
    expireTime: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: "This is the cookie token", AdminToken: token });
};

//exporting the module
module.exports = empAuthController;
