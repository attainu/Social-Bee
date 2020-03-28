//importing all the packages
const express = require("express");
const adminRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  defAdmin,
  signup,
  addDep,
  showDep,
  showAllEmp
} = require("../../controllers/AdminApiController/adminController");

//defining the routes

//the default route for admin
adminRouter.route("/").get(defAdmin);
//adding department data into the database route
adminRouter.route("/add/department").post(addDep);
//displaying all the department data
adminRouter.route("/show/department").get(showDep);
//signup route
adminRouter.route("/signup").post(signup);
//displaying all employee data route
adminRouter.route("/show/employee").get(showAllEmp);

//exporting the router module
module.exports = adminRouter;
