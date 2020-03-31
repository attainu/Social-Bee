const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Bring the env variables here
dotenv.config({ path: './config/config.env' });

//BRing up th Models
const ngoData = require('./models/ngo_models/ngoData');

//bring up the database connection
mongoose.connect(process.env.MONGO_LOCAL_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
});

//Read the JSON Files
const ngomockData = JSON.parse(
  fs.readFileSync(`${__dirname}/mockData/ngoData.json`, 'utf-8')
);

//import into DB
const importData = async () => {
  try {
    await ngoData.create(ngomockData);

    console.log('DATA DUMPED IN DB'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//TO delete all the data
const deleteData = async () => {
  try {
    await ngoData.deleteMany();

    console.log('DATA WIPED OUT FROM DB'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//command check and procees with seeding
if (process.argv[2] === '-add') {
  importData();
} else if (process.argv[2] === '-delete') {
  deleteData();
}
