//importing all the base packages
const express = require("express");
const path = require("path");
const morgan = require("morgan");

//importing the database connection localhost/Atlas in the server file
require("./config/db");

//declaring the port variable
const PORT = process.env.PORT || 8080;

//initillizaing the express module
const app = express();

//setting up the middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//setting up the server port for listning
app.listen(PORT, () => {
  console.log(`Express server listing on ${PORT}`);
});
