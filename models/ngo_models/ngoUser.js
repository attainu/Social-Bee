//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the ngo schema
const ngoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      unique: true,
      trim: true,
      maxlength: [20, "Name can't be more than 20 characters"]
    },
    phone: {
      type: Number,
      maxlength: [15, "Phone number can not be longer than 15 characters"]
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ],
      required: true,
      trim: true
    },
    ngoName: {
      type: String,
      required: [true, "Please provide NGO's name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can't be more than 50 characters"]
    },
    ngoDescription: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"]
    },
    ngoWebsiteUrl: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS"
      ]
    },
    ngoAddress: {
      type: String,
      required: [true, "Please add an address"]
    },
    ngoIsregistered: {
      type: Boolean
    },
    group: {
      type: String,
      required: true,
      enum: ["Human", "Animal", "Nature"],
      category: {
        type: String,
        required: true,
        enum: ["Human", "Animal", "Nature"]
      }
    }
  },
  { timestamps: true }
);

//exporting the schema
module.exports = mongoose.model("ngoUser", ngoSchema);
