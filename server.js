//importing all the base modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error_handler");

//importing the ngo related routes
// const NgoGetRoutes = require("./routes/NgoRoutes/NgoGetRoutes");
// const NgoApiRoutes = require("./routes/NgoRoutes/NgoApiRoutes");
// const route = require("./routes/user");

//importing the admin related routes
const admin = require("./routes/AdminRoutes/adminRoutes");

//importing the DB connection localhost/Atlas in the server file
const connectDB = require("./config/db");

//load env variables
dotenv.config({ path: "./config/config.env" });

//declaring the port variable
const PORT = process.env.PORT || 8080;

//call to DB
connectDB();

//initillizaing the express module
const app = express();

//setting up the middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

//setting up the ngo routes
// app.use(NgoGetRoutes);
// app.use(NgoApiRoutes);
// app.use("/api", route);

//mounting the route to a default path
app.use("/api/v1/admin", admin);

//setting up the custom error handler have to put it after the routes in order to let javascript catch it
app.use(errorHandler);

//setting up the server port for listening
app.listen(PORT, () => {
  console.log(
    `Express server Listing on Port: ${PORT} & running in :${process.env.NODE_ENV} `
      .yellow.underline.bold
  );
});
// app.use(‘/uploads’, path.join(__dirname, ‘static’));
// app.use(‘/uploads’, express.static(path.join(__dirname, ‘static’)));
