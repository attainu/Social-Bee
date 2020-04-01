//importing all the packages
const express = require("express");
const ngoRouter = express.Router();

//setting up a destructured object to import all the controller functions
var { defNgo, addNgo } = require("../controllers/NgoController");

//the default route for admin
ngoRouter.route("/").get(defNgo);
//adding department data into the database route
ngoRouter.route("/add-ngo").post(addNgo);

//exporting the router module
module.exports = ngoRouter;
