//importing all the packages
const express = require("express");
const adminRouter = express.Router();

//setting up a destructured object to import all the controller functions
var {
  defAdmin,
  addDep,
  showDep,
  showAllEmp,
  showOneDep,
  showOneEmp,
  updateEmp,
  updateEmp_Dep,
  deleteEmp,
  deleteDep,
  deleteUser,
} = require("../controllers/adminController");

//defining the routes

//the default route for admin
adminRouter.route("/home").get(defAdmin);
//adding department data into the database route
adminRouter.route("/add/department").post(addDep);
//displaying all the department data
adminRouter.route("/show/department").get(showDep);
//displaying one department data
adminRouter.route("/show/department/:id").get(showOneDep);
//displaying all employee data route
adminRouter.route("/show/employee").get(showAllEmp);
//displaying one employee data
adminRouter.route("/show/employee/:id").get(showOneEmp);
//updating one employee data
adminRouter.route("/update/employee/:id").put(updateEmp);
//updating the employee department data
adminRouter.route("/update/department/:id").put(updateEmp_Dep);
//deleting an employee data
adminRouter.route("/delete/employee/:id").delete(deleteEmp);
//deleting a department data
adminRouter.route("/delete/department/:id").delete(deleteDep);
//deleting a user data
adminRouter.route("/delete/user/:id").delete(deleteUser);

//exporting the router module
module.exports = adminRouter;
