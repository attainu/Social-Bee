//importing the custom error response module
const ErrorResponse = require("../utils/error_response");

//importing the asyncHandler module
const asyncHandler = require("../middlewares/async_handler");

//importing the ngoData schema
const NgoData = require("../models/ngo_models/NgoData");

//declaring an empty object to store and export the methods
var ngoController = {};

//@desc     Default admin route
//@route    GET /api/v1/ngo
//@access   public
ngoController.defNgo = (req, res, next) => {
  res.status(200).json({ success: true, message: "Welcome to Ngo Pannel" });
};

//@desc     employee department data addition route
//@route    POST /api/v1/admin/add/department
//@access   private
ngoController.addNgo = asyncHandler(async (req, res, next) => {
  let ngoData = new NgoData(req.body);
  await ngoData.save();
  res
    .status(201)
    .json({ success: "Ngo Details added to database", Ngo_Details: ngoData });
});
//exporting the module
module.exports = ngoController;
