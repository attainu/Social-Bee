//importing express and setting up the router
const express = require("express");
var NgoGetRouter = express.Router();

//setting up a destructured object to import all the controller functions
var { api, ngo } = require("../../controllers/NgoController/NgoGetController");

//defining the routes
NgoGetRouter.get("/api", api);
NgoGetRouter.get("/api/ngo", ngo);

//exporting the module
module.exports = NgoGetRouter;
