//mongo atlas connection configaration settings
const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: true
//     });
//     console.log(`MongoDB is up @ MongoAtlas :${conn.connection.host}`.green.underline.bold);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

//Local connection -MongoDB-Compass
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true
    });
    console.log(
      `MongoDB is up @ mongoLocal :${conn.connection.host}`.green.underline.bold
    );
  } catch (error) {
    console.error(error,``.red);
    process.exit(1);
  }
};

module.exports = connectDB;
