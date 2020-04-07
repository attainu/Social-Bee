//importing the required packages
const bcrypt = require("bcryptjs");
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
      unique: true,
    },
    emp_name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    emp_email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      required: [true, "Please provide email"],
      trim: true,
      unique: true,
    },
    emp_password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emp_access_lvl: {
      type: Number,
      required: [true, "Enter access level number from 1-5"],
      maxlength: 1,
      trim: true,
    },
    emp_desgination: {
      type: String,
      required: [true, "Please provide designation"],
      trim: true,
    },
    dep_id: [{ type: Schema.Types.ObjectId, ref: "dep" }],
  },
  { timestamps: true }
);

//encrypting the password
empSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.emp_password = await bcrypt.hash(this.emp_password, salt);
});

//generating jwt token for login
empSchema.methods.getJwtToken=function (){
  
}

//exporting the schema
module.exports = mongoose.model("emp", empSchema);
