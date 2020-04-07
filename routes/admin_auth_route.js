const express = require("express");
const adminAuthRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  defAuthAdmin,
  signup,
  login,
} = require("../controllers/admin_auth_controller");

//defining the routes

//the default route for admin
adminAuthRouter.route("/").get(defAuthAdmin);
//signup route
adminAuthRouter.route("/signup").post(signup);
//login route
adminAuthRouter.route("/login").post(login);

//exporting the router module
module.exports = adminAuthRouter;
