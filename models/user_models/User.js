//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
      trim: true
    }
  },
  { timestamps: true }
);
// Mongoose middleware is being used before Saving the User data with the JWT TOKEN in DB.

UserSchema.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

//exporting the schema
const User = mongoose.model("User", UserSchema);
module.exports = User;

/*Note to atanu
Can we make a single User Schema for both Admin and User?
by specifying a option in the schema itself?
*/

// resetPasswordToken: String,
// resetPasswordExpire: ___  we need to add this in  for Tokens
