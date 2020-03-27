//importing the database connection into the file
require("../../config/db");

//importing the model schemas
const Ngo = require("../../models/ngo_models/ngoData");
const User = require("../../models/user_models/User");

//declaring an empty object to store and export the functions
var ngoApiController = {};

//defining the functions
//function to register the user in the database
// ngoApiController.registerUser = (req, res) => {
//   console.log(req.body)
//   let newUser = new User({ ...req.body });
//   newUser
//     .save()
//     .then(() => {
//       res.status(201).json({ newUser });
//     })
//     .catch(err => {
//       res.status(400).json({ err });
//     });
// };
//exporting the module
module.exports = ngoApiController;
