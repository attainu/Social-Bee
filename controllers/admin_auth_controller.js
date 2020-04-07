//importing the custom error response module
const ErrorResponse = require("../utils/error_response");

//importing the asyncHandler module
const asyncHandler = require("../middlewares/async_handler");

//importing the admin model schemas
const Employee = require("../models/admin_models/Emp");

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
  let empData = new Employee(req.body);
  await empData.save();

  //create token
  const token = empData.getJwtToken();
  res.status(201).json({
    success: "Employee data added",
    empData: empData,
    Jwt_Token: token,
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
  const token = empData.getJwtToken();
  res.status(200).json({
    success: "Loged In",
    empData: empData,
    Jwt_Token: token,
  });
});
//exporting the module
module.exports = empAuthController;
