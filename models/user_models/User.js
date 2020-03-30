//importing the required packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'ngoRep'],
      default: 'user'
    },
    profilepic: {
      type: String,
      default: 'no-photo.png'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 3,
      select: false,
      trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  // is being called on actual user,so this is used to access field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire --10 minutes setting
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; //it will be stored
};

module.exports = mongoose.model('User', UserSchema);

//
//

//
//

//
//

//
//

/*Note to atanu
Can we make a single User Schema for both Admin and User?
by specifying a option in the schema itself?
*/

// resetPasswordToken: String,
// resetPasswordExpire: ___  we need to add this in  for Tokens

// Mongoose middleware is being used before Saving the User data with the JWT TOKEN in DB.

// UserSchema.pre("save", async function(next) {
//   // Hash the password before saving the user model
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
//   next();
// });

// UserSchema.methods.generateAuthToken = async function() {
//   // Generate an auth token for the user
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return token;
// };

// UserSchema.statics.findByCredentials = async (email, password) => {
//   // Search for a user by email and password.
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error({ error: "Invalid login credentials" });
//   }
//   const isPasswordMatch = await bcrypt.compare(password, user.password);
//   if (!isPasswordMatch) {
//     throw new Error({ error: "Invalid login credentials" });
//   }
//   return user;
// };

// //exporting the schema
