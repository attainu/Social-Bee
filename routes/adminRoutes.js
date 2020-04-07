//imoprting the admin protection middleware
const { AdminAuthProtect } = require("../middlewares/admin_auth");
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
  MyProfile,
  updateEmp,
  updateEmp_Dep,
  deleteEmp,
  deleteDep,
  deleteUser,
} = require("../controllers/adminController");

//defining the routes

//the default route for admin
adminRouter.route("/home").get(AdminAuthProtect, defAdmin);

//adding department data into the database route
adminRouter.route("/add/department").post(AdminAuthProtect, addDep);

//displaying all the department data
adminRouter.route("/show/department").get(AdminAuthProtect, showDep);

//displaying currently looged in employee data
adminRouter.route("/show/employee/profile").get(AdminAuthProtect, MyProfile);

//displaying all employee data route
adminRouter.route("/show/employee").get(AdminAuthProtect, showAllEmp);

//displaying one department data
adminRouter.route("/show/department/:id").get(AdminAuthProtect, showOneDep);

//displaying one employee data
adminRouter.route("/show/employee/:id").get(AdminAuthProtect, showOneEmp);

//updating one employee data
adminRouter.route("/update/employee/:id").put(AdminAuthProtect, updateEmp);

//updating the employee department data
adminRouter
  .route("/update/department/:id")
  .put(AdminAuthProtect, updateEmp_Dep);

//deleting an employee data
adminRouter.route("/delete/employee/:id").delete(AdminAuthProtect, deleteEmp);

//deleting a department data
adminRouter.route("/delete/department/:id").delete(AdminAuthProtect, deleteDep);

//deleting a user data
adminRouter.route("/delete/user/:id").delete(AdminAuthProtect, deleteUser);

//exporting the router module
module.exports = adminRouter;
