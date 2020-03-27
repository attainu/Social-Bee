//importing the required packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mongoose middleware is being used before Saving the User data with the JWT TOKEN in DB.

userSchema.pre('save', async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

//exporting the schema
module.exports = mongoose.model('User', userSchema);

/*Note to atanu
Can we make a single User Schema for both Admin and User?
by specifying a option in the schema itself?
*/

// resetPasswordToken: String,
// resetPasswordExpire: ___  we need to add this in  for Tokens
