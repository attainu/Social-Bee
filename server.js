//importing all the base modules
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const fileupload = require("express-fileupload");

//importing the DB connection localhost/Atlas in the server file
const connectDB = require("./config/db");

//load env variables
dotenv.config({ path: "./config/config.env" });

//importing custom middlewares
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error_handler");

//initillizaing the express module
const app = express();

//setting the public folder as static so that we can view the images
app.use(express.static(path.join(__dirname, "public")));

//importing the admin related routes
const admin = require("./routes/adminRoutes");

//importing User related routes
const user = require("./routes/User_Route");

//importing the Ngo Related routes
const ngo = require("./routes/Ngo_Routes");

//declaring the port variable
const PORT = process.env.PORT || 8080;

//call to DB
connectDB();

//setting up the middlewares

//setting an if block for morgan so it only logs if in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//express middleware to accept json data form postman
app.use(express.json());

//express middleware to accept form data form postman and/or forntend webpages if api is used
app.use(express.urlencoded({ extended: false }));

//file uploading middleware
app.use(fileupload());

//custom logger middleaware not so important does exactly what morgan does but in rudamentry manner. I made it just for fun.
app.use(logger);

//setting up the ngo routes

//mounting the route to a default path
app.use("/api/v1/admin", admin);
app.use("/api/v1/user", user);
app.use("/api/v1/ngo", ngo);

//setting up the custom error handler have to put it after the routes in order to let javascript catch it
app.use(errorHandler);

//to handle ERROR for non existent routes/missing routes
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname+'/public'+'/static'+'/404.html'))
});


//setting up the server port for listening
app.listen(PORT, () => {
  console.log(
    `Express server Listing on Port: ${PORT} & running in :${process.env.NODE_ENV} `
      .yellow.underline.bold
  );
});
