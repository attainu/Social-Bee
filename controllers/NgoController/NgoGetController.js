//importing the model schemas
const ngo = require("../../models/ngo_models/ngoData");
const user = require("../../models/user_models/User");

//declaring an empty object to store and export the functions
var ngoGetController = {};

//defining the get functions
//default route
ngoGetController.ngo = (req, res) => {
  res.sendStatus(200, "AOK");
};

//exporting the modules
module.exports = ngoGetController;
