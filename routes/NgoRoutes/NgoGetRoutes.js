//importing express and setting up the router
const express = require("express");
var NgoGetRouter = express.Router();

//setting up a destructured object to import all the controller functions
var { ngo } = require("../../controllers/NgoController/NgoGetController");

//defining the routes
NgoGetRouter.get("/ngo", ngo);

//exporting the module
module.exports = NgoGetRouter;
