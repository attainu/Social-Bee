//importing the required packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the ngo schema
const ngoSchema = new Schema(
  {
    directorName: {
      type: String,
      required: [true, "Please provide Director name"],
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
    ngoRegistrationNumber: {
      type: String,
      required: [true, "Please add the 10 Digit Unique Registration Number"]
    },
    ngoFounded: {
      type: Number,
      required: [true, "Please mention the year of Foundation"]
    },
    ngoWorkers: {
      type: Number,
      required: [true, "Please add Number of Workers"]
    },
    ngoAccomodation: {
      type: Boolean
    },
    ngoWebsiteUrl: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS"
      ]
    },
    // ngoAddress: {
    //   type: String,
    //   required: [true, "Please add an address"]
    // },
    location: {
      //setting up the location field for GeoJson points
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    ngoImg: {
      type: String,
      default: "no-photo.png"
    },
    ngoFunding: {
      type: [String],
      required: true,
      enum: ["public", "private"]
    },
    group: {
      type: [String],
      required: true,
      enum: ["humanService", "animalService", "natureService"]
    },
    category: {
      type: [String],
      required: true,
      enum: [
        "orphanage",
        "shelterHouse",
        "oldAge",
        "otherHumanService",
        "cowShelter",
        "birdShelter",
        "dogShelter",
        "otherAnimalService",
        "saveWaterBodies",
        "saveTrees",
        "saveAir",
        "otherNatureService"
      ]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

//exporting the schema
module.exports = mongoose.model("ngoData", ngoSchema);

/*Need to add the following parameter fot GEO_JSON DATA
 */

// const citySchema = new mongoose.Schema({
//   name: String,
//   location: {
//     type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }
//   }
// });
