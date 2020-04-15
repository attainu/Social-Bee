//importing the node-geocoder package
const NodeGecoder = require("node-geocoder");

//setting the options for the geocoder
const options = {
  provier: process.env.GEOCODER_PROVIDER,
  clientId: process.env.GEOCODER_CLIENT_ID,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGecoder(options);
//exporting the module
module.exports = geocoder;
