//importing the required packages
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  if (!this.isModified("emp_password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.emp_password = await bcrypt.hash(this.emp_password, salt);
});

//generating jwt token for login
empSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// method to match the plain text password with the encrypted password in the database for login
empSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.emp_password);
};

//generating and hashing the password reset token
empSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hashing the token and storing in the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //setting the expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//exporting the schema
module.exports = mongoose.model("emp", empSchema);
