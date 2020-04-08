//imopting the required packages
const path = require("path");

//importing the custom error response module
const ErrorResponse = require("../utils/error_response");

//importing the asyncHandler module
const asyncHandler = require("../middlewares/async_handler");

//importing the ngoData schema
const NgoData = require("../models/ngo_models/ngoData");

//declaring an empty object to store and export the methods
var ngoController = {};

//@desc     Default Ngo route
//@route    GET /api/v1/ngo
//@access   public
ngoController.defNgo = (req, res, next) => {
  res.status(200).json({ success: true, message: "Welcome to Ngo Pannel" });
};

//@desc     route to add ngo data to the database
//@route    POST /api/v1/ngo/add-ngo
//@access   private
ngoController.addNgo = asyncHandler(async (req, res, next) => {
  let ngoData = new NgoData(req.body);
  ngoData.user = req.user;
  await ngoData.save();
  res
    .status(201)
    .json({ success: "Ngo Details added to database", Ngo_Details: ngoData });
});

//@desc     route to search all the ngo data
//@route    GET /api/v1/ngo/show_ngo
//@access   private
ngoController.showAllngo = asyncHandler(async (req, res, next) => {
  let showAllNgo = await NgoData.find().populate({
    path: "user",
    select: "name email",
  });
  res.status(200).json({
    success: "All Ngo data",
    count: showAllNgo.length,
    Ngo_Details: showAllNgo,
  });
});

//@desc     route to search one the ngo data based on id
//@route    GET /api/v1/ngo/show_ngo/:id
//@access   private
ngoController.showNgo = asyncHandler(async (req, res, next) => {
  let showNgo = await NgoData.findById(req.params.id).populate({
    path: "user",
    select: "name email",
  });
  res.status(200).json({
    success: "Ngo data",
    count: showNgo.length,
    Ngo_Details: showNgo,
  });
});

//@desc     updating an ngo data
//@route    PUT /api/v1/ngo/update/:id
//@access   private
ngoController.updateNgo = asyncHandler(async (req, res, next) => {
  let updateNgo = await NgoData.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateNgo) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Ngo Information Updated", Ngo_Data: updateNgo });
});

//@desc     uploading photo
//@route    PUT /api/v1/ngo/:id/photo
//@access   private
ngoController.photoUpload = asyncHandler(async (req, res, next) => {
  let ngo = await NgoData.findById(req.params.id);

  //if condition to check if id exsists or not the database
  if (!ngo) {
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }

  //if conditionto check a file was uploaded or not
  if (!req.files) {
    return next(
      new ErrorResponse(`Please select a image or Photo to upload`, 400)
    );
  }

  //storing the file object recived form postman in an variable
  const file = req.files.file;

  //checking to see if the file sent is an image or not
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Plese select and image file`, 415));
  }

  //checking if the image file size is more than 2 mb or not
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Image size can not be more than ${process.env.MAX_FILE_SIZE} bytes i.e ${process.env.MAX_FILE_SIZE_MB}MB`,
        413
      )
    );
  }

  //creating a custom file name to stroe in databse so that nameing conflicts doesn't happen if 2 or more user upload the same image file.
  file.name = `photo_${ngo._id}${path.parse(file.name).ext}`;

  //uploading the file in the database
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(`Server Error: File could not uploaded`, 500)
      );
    }
    await NgoData.findByIdAndUpdate(req.params.id, {
      ngoImg: `photos/${file.name}`,
    });

    res.status(200).json({ success: "Image uploaded", data: file.name });
  });
});

//@desc     delete a ngo data
//@route    DELETE /api/v1/ngo/delete/:id
//@access   private
ngoController.deleteNgo = asyncHandler(async (req, res, next) => {
  let deleteNgo = await NgoData.findByIdAndDelete(req.params.id);
  if (!deleteNgo) {
    //if condition to check if id exsists or not the database
    return next(
      new ErrorResponse(
        `Document or Record not found with id:${req.params.id}. Check ID`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: "Ngo Information Deleted", Ngo_Data: deleteNgo });
});

//@desc     route to search one the ngo data based on query
//@route    GET /api/v1/ngo/query
//@access   private
ngoController.showNgoQ = asyncHandler(async (req, res, next) => {
  let showNgo = await NgoData.find(req.query);
  res.status(200).json({
    success: "Ngo data",
    count: showNgo.length,
    Ngo_Details: showNgo,
  });
});

//@desc     route to select and sort ngos
//@route    GET /api/v1/ngo/detail
//@access   private
ngoController.showNgoQSelectSort = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  //field to exclude from the query
  const removeFileds = ["select", "sort"];

  //looping to remove the unwanted fields
  removeFileds.forEach((param) => delete reqQuery[param]);

  //Select fileds query
  if (req.query.select && req.query.sort) {
    const fields = req.query.select.split(",").join(" ");
    const sortBy = req.query.sort.split(",").join(" ");
    query = NgoData.find().select(fields).sort(sortBy);
  }

  let showNgo = await query;
  res.status(200).json({
    success: "Ngo data",
    count: showNgo.length,
    Ngo_Details: showNgo,
  });
});

//@desc     route for pageination
//@route    GET /api/v1/ngo/detail/page
//@access   private
ngoController.showNgoPageInit = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  //field to exclude from the query
  const removeFileds = ["page", "limit"];

  //looping to remove the unwanted fields
  removeFileds.forEach((param) => delete reqQuery[param]);

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  query = NgoData.find().skip(startIndex).limit(limit);

  let showNgo = await query;
  const totalDoc = await NgoData.countDocuments();

  //page ination result
  const pageination = {};

  if (lastIndex < totalDoc) {
    pageination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pageination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: "Ngo data",
    count: showNgo.length,
    pageination,
    Ngo_Details: showNgo,
  });
});
//exporting the module
module.exports = ngoController;
