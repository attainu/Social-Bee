//importing the model schemas
const ngo = require("../../models/ngo_models/ngoData");
const user = require("../../models/user_models/User");

//declaring an empty object to store and export the functions
var ngoGetController = {};

//defining the get functions
//default route
ngoGetController.api = (req, res) => {
  res.sendStatus(200, "AOK");
};
ngoGetController.ngo = (req, res) => {
  const text = "AOKKKK";
  res.status(200).json(text);
};

//exporting the modules
module.exports = ngoGetController;
