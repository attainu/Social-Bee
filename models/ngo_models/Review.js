//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the review schema
const ngoReview = new Schema(
  {
    ngo: [
      {
        type: Schema.Types.ObjectId,
        ref: "ngoData"
      }
    ],
    reviewContent: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      maxlength: 5,
      required: [true, "Please enter a rating"],
      trim: true
    }
  },
  { timestamps: true }
);
//exporting the schema
module.exports = mongoose.model("review", ngoReview);
