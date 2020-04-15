const express = require("express");
const crypto = require("crypto");
const adminAuthRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  defAuthAdmin,
  signup,
  login,
  ForgotPassword,
  resetPassword,
  logout,
} = require("../controllers/admin_auth_controller");

//defining the routes

//the default route for admin
adminAuthRouter.route("/").get(defAuthAdmin);
//signup route
adminAuthRouter.route("/signup").post(signup);
//login route
adminAuthRouter.route("/login").post(login);
//logout route
adminAuthRouter.route("/logout").get(logout);
//forgot password route
adminAuthRouter.route("/forgotpassword").post(ForgotPassword);
//reset password route
adminAuthRouter.route("/resetpassword/:resetToken").put(resetPassword);

//exporting the router module
module.exports = adminAuthRouter;
