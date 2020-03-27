//importing express and setting up the router
const express = require("express");
var NgoApiRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  registerUser
} = require("../../controllers/NgoController/NgoApiController");

//defining the routes
// NgoApiRouter.post("/registerUser", registerUser);

//exporting the module
module.exports = NgoApiRouter;
