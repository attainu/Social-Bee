//importing all the base modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error_handler");

//initillizaing the express module
const app = express();

//importing the ngo related routes

//importing the admin related routes
const admin = require("./routes/adminRoutes");

//importing User related routes
const user = require("./routes/User_Route");

//importing the Ngo Related routes
//not sure about this approach need to rethink this as ngo data manipulation needs to be protected.using this now just for testing purposes
const ngo = require("./routes/Ngo_Routes");

// require("./controllers/payment")(app);

//importing the DB connection localhost/Atlas in the server file
const connectDB = require("./config/db");

//load env variables
dotenv.config({ path: "./config/config.env" });

//declaring the port variable
const PORT = process.env.PORT || 8080;

//call to DB
connectDB();

//setting up the middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

//setting up the ngo routes

//mounting the route to a default path
app.use("/api/v1/admin", admin);
app.use("/api/v1/user", user);
//not sure about this approach need to rethink this as ngo data manipulation needs to be protected. using this now just for testing purposes
app.use("/api/v1/ngo", ngo);

//setting up the custom error handler have to put it after the routes in order to let javascript catch it
app.use(errorHandler);

//setting up the server port for listening
app.listen(PORT, () => {
  console.log(
    `Express server Listing on Port: ${PORT} & running in :${process.env.NODE_ENV} `
      .yellow.underline.bold
  );
});
