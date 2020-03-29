//importing the database connection
require("../../config/db");

//importing the custom error response module
const ErrorResponse = require("../../utils/error_response");

//importing the asyncHandler module
const asyncHandler = require("../../middlewares/async_handler");

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
};

//@desc     employee department data addition route
//@route    POST /api/v1/admin/add/department
//@access   public
empController.addDep = asyncHandler(async (req, res, next) => {
  let depData = new EmpDepartment(req.body);
  await depData.save();
  res.status(201).json({ success: "Department data added", depData: depData });
});

//@desc     Fetching and Displaying all deparment data
//@route    GET /api/v1/admin/show/department
//@access   private
empController.showDep = asyncHandler(async (req, res, next) => {
  let showDep = await EmpDepartment.find();
  res.status(200).json({
    success: "All Department",
    count: showDep.length,
    showDep: showDep
  });
});

//@desc     Fetching and Displaying one deparment data
//@route    GET /api/v1/admin/show/department/:id
//@access   private
empController.showOneDep = asyncHandler(async (req, res, next) => {
  let showOneDep = await EmpDepartment.findById(req.params.id);
  if (!showOneDep) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Department Information", showOneDep: showOneDep });
});

//@desc     updating an emp_department data
//@route    PUT /api/v1/admin/update/department/:id
//@access   private
empController.updateEmp_Dep = asyncHandler(async (req, res, next) => {
  let updateEmp_Dep = await EmpDepartment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  if (!updateEmp_Dep) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res.status(200).json({
    success: "Employee Information Updated",
    updateEmp_Dep: updateEmp_Dep
  });
});

//@desc     delete a entire department
//@route    DELETE /api/v1/admin/delete/department/:id
//@access   private
empController.deleteDep = asyncHandler(async (req, res, next) => {
  let deleteDep = await EmpDepartment.findByIdAndDelete(req.params.id);
  if (!deleteDep) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res.status(200).json({
    success: "Department Information Deleted",
    deleteDep: deleteDep
  });
});

//@desc     Admin regisration/signup route
//@route    POST /api/v1/admin/signup
//@access   public
empController.signup = asyncHandler(async (req, res, next) => {
  let empData = new Employee(req.body);
  await empData.save();
  res.status(201).json({ success: "Employee data added", empData: empData });
});

//@desc     displaying all the employee data
//@route    POST /api/v1/admin/show/employee
//@access   private
empController.showAllEmp = asyncHandler(async (req, res, next) => {
  let showAllEmp = await Employee.find();
  res.status(200).json({
    success: "All Employee data",
    count: showAllEmp.length,
    showAllEmp: showAllEmp
  });
});

//@desc     displaying one employee data
//@route    POST /api/v1/admin/show/employee/:id
//@access   private
empController.showOneEmp = asyncHandler(async (req, res, next) => {
  let showOneEmp = await Employee.findById(req.params.id);
  if (!showOneEmp) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Employee Information", showOneEmp: showOneEmp });
});

//@desc     updating an employee data
//@route    PUT /api/v1/admin/update/employee/:id
//@access   private
empController.updateEmp = asyncHandler(async (req, res, next) => {
  let updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updateEmp) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Employee Information Updated", updateEmp: updateEmp });
});

//@desc     delete an employee data
//@route    DELETE /api/v1/admin/delete/employee/:id
//@access   private
empController.deleteEmp = asyncHandler(async (req, res, next) => {
  let deleteEmp = await Employee.findByIdAndDelete(req.params.id);
  if (!deleteEmp) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Employee Information Deleted", deleteEmp: deleteEmp });
});
//exporting the module
module.exports = empController;
