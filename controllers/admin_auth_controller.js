//importing the rrquired pacakages
const nodemailer = require("nodemailer");

//importing the custom error response module
const ErrorResponse = require("../utils/error_response");

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
  let transpoter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  await transpoter.sendMail({
    from: process.env.FROM_EMAIL,
    to: emp_email,
    subject: `Welcome To ${process.env.FROM_NAME}`,
    html: `<h1>Welcome To ${process.env.FROM_NAME}</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non convallis urna. Nam quam ipsum, imperdiet eget lacus sed, finibus aliquam mi. Phasellus ac lorem in nibh accumsan ultricies et euismod tellus. Morbi blandit et quam et rhoncus. Pellentesque scelerisque nunc non mi feugiat tempus.</p><p></p>This is Your Email and password.<ul><li>Email:${emp_email}</li><li>Password:${emp_password}</li<</ul><p>Thank You.</p>`,
  });

  let empData = new Employee(req.body);
  await empData.save();

  res.status(201).json({
    success: "Employee Signed Up",
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
