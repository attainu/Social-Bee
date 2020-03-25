//importing the required packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//exporting the schema
module.exports = mongoose.model('User', UserSchema);

/*Note to atanu
Can we make a single User Schema for both Admin and User?
by specifying a option in the schema itself?
*/

// resetPasswordToken: String,
// resetPasswordExpire: ___  we need to add this in future for Tokens
