//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "ngoRep"],
      default: "user",
    },
    profilepic: {
      type: String,
      default: "photos/no-photo.png",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  // is being called on actual user,so this is used to access field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire --10 minutes setting
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; //it will be stored
};

//cascade delete ngos when and user related to those ngos gets deleted
UserSchema.pre("remove", async function (next) {
  console.log(`Ngos getting deleted that are attached with user ${this._id}`);
  await this.model("ngoData").deleteMany({ user: this._id });
  next();
});

//reverse populate with mongoose virtuals
UserSchema.virtual("ngoOwned", {
  ref: "ngoData",
  localField: "_id",
  foreignField: "user",
  jsutOne: false,
});
module.exports = mongoose.model("User", UserSchema);
