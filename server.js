//importing all the base packages
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

//importing the DB connection localhost/Atlas in the server file
const connectDB = require('./config/db');

//load env variables
dotenv.config({ path: './config/config.env' });

//declaring the port variable
const PORT = process.env.PORT || 8080;

//call to DB
connectDB();

//initillizaing the express module
const app = express();

//setting up the middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//setting up the server port for listening
app.listen(PORT, () => {
  console.log(
    `Express server Listing on Port: ${PORT} & running in :${process.env.NODE_ENV} `
  );
});
