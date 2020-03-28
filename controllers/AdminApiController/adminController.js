//importing the database connection
require("../../config/db");

//importing the admin model schemas
const Employee = require("../../models/admin_models/Emp");
const EmpDepartment = require("../../models/admin_models/Emp_department");

//declaring an empty object to store and export the methods
var empController = {};

//defining the functions

//@desc     Default admin route
//@route    GET /api/v1/admin
//@access   public
empController.defAdmin = (req, res, next) => {
  res.status(200).json({ success: true, message: "Welcome to Admin Pannel" });
  next();
};

//@desc     employee department data addition route
//@route    POST /api/v1/admin/add/department
//@access   public
empController.addDep = async (req, res, next) => {
  try {
    let depData = new EmpDepartment(req.body);
    await depData.save();
    res
      .status(201)
      .json({ success: "Department data added", depData: depData });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
  next();
};

//@desc     Fetching and Displaying all deparment data
//@route    GET /api/v1/admin/show/department
//@access   private
empController.showDep = async (req, res, next) => {
  try {
    let showDep = await EmpDepartment.find();
    res.status(200).json({ success: "All Department", showDep: showDep });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
  next();
};

//@desc     Admin regisration/signup route
//@route    POST /api/v1/admin/signup
//@access   public
empController.signup = async (req, res, next) => {
  try {
    let empData = new Employee(req.body);
    await empData.save();
    res.status(201).json({ success: "Employee data added", empData: empData });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
  next();
};

//@desc     displaying all the employee data
//@route    POST /api/v1/admin/show/employee
//@access   private
empController.showAllEmp = async (req, res, next) => {
  try {
    let showAllEmp = await Employee.find();
    res
      .status(200)
      .json({ success: "All Employee data", showAllEmp: showAllEmp });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
  next();
};

//exporting the module
module.exports = empController;
