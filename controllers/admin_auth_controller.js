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
  res.status(201).json({ success: "Employee data added", empData: empData });
});
//exporting the module
module.exports = empAuthController;
