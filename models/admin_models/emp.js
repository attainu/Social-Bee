//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the company employee schema
const empSchema = new Schema(
  {
    emp_name: {
      type: String,
      required: [true, "Please provide name"],
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
      required: true,
      trim: true
    },
    dep_id: [{ type: Schema.Types.ObjectId, ref: emp_department }]
  },
  { timestamps: true }
);
//exporting the schema
module.exports = mongoose.model("emp", empSchema);
