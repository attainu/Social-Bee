//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the company employee schema
const empSchema = new Schema(
  {
    //emp_number is not same as emp Object Id it is the 6 digit number given by the company
    emp_number: {
      type: Number,
      required: [true, "Please provide the employee number"],
      trim: true,
      unique: true
    },
    emp_name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true
    },
    emp_email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ],
      required: [true, "Please provide email"],
      trim: true,
      unique: true
    },
    emp_password: {
      type: String,
      required: [true, "Please provide password"],
      trim: true
    },
    emp_access_lvl: {
      type: Number,
      required: [true, "Enter access level number from 1-5"],
      maxlength: 1,
      trim: true
    },
    emp_desgination: {
      type: String,
      required: [true, "Please provide designation"],
      trim: true
    },
    dep_id: [{ type: Schema.Types.ObjectId, ref: "dep" }]
  },
  { timestamps: true }
);
//exporting the schema
module.exports = mongoose.model("emp", empSchema);
