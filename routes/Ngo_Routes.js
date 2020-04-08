//importing all the packages
const { protect } = require("../middlewares/auth");
const express = require("express");
const ngoRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  defNgo,
  addNgo,
  showAllngo,
  showNgo,
  updateNgo,
  photoUpload,
  deleteNgo,
  showNgoQ,
  showNgoQSelectSort,
  showNgoPageInit,
} = require("../controllers/ngoController");

//the default route for ngo
ngoRouter.route("/").get(defNgo);

//adding ngo data into the database route
ngoRouter.route("/add-ngo").post(protect, addNgo);

//displaying all the ngo data
ngoRouter.route("/show_ngo").get(protect, showAllngo);

//displaying one ngo based on id data
ngoRouter.route("/show_ngo/:id").get(protect, showNgo);

//updating one ngo data
ngoRouter.route("/update/:id").put(protect, updateNgo);

//uploading a image to a ngo data
ngoRouter.route("/:id/photo").put(protect, photoUpload);

//deleting ngo data
ngoRouter.route("/delete/:id").delete(protect, deleteNgo);

//displaying one ngo data using req.query and some advance filtring
ngoRouter.route("/query").get(protect, showNgoQ);

//displaying one ngo by selecting one field
ngoRouter.route("/detail").get(protect, showNgoQSelectSort);

//page ination route
ngoRouter.route("/detail/page").get(protect, showNgoPageInit);

//exporting the router module
module.exports = ngoRouter;
