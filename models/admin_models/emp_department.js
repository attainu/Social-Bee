//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the company employee schema
const depSchema = new Schema(
  {
    dep_name: {
      type: String,
      required: [true, "Please provide department name"],
      trim: true
    },
    number_of_emp: {
      type: Number,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);
//exporting the schema
module.exports = mongoose.model("dep", depSchema);
