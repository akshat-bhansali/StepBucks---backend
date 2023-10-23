const Contest = require("../models/contestModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//Create contest -- admin
exports.createContest= catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload_large(images[i], {
      folder: "contests",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const contest = await Contest.create(req.body);

  res.status(201).json({
    success: true,
    contest,
  });
});

//Get all contests
exports.getAllContests = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 4;
  const contestsCount = await Contest.countDocuments();

  const apiFeature = new ApiFeatures(Contest.find(), req.query)
    .search()
    .filter()
    let filteredContestsCount = await apiFeature.query.length;
  apiFeature.pagination(resultPerPage);
  let contests = await apiFeature.query;

  res.status(200).json({
    success: true,
    contests,
    contestsCount,
    resultPerPage,
    filteredContestsCount,
  });
});

//Get one contest detail
exports.getContestDetail = catchAsyncErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next(new ErrorHander("Contest not found", 404));
  }

  res.status(200).json({
    success: true,
    contest,
  });
});

// Delete Contest

exports.deleteContest = catchAsyncErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);

  if (!contest) {
    return next(new ErrorHander("Contest not found", 404));
  }
  await contest.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contest Delete Successfully",
  });
});

//Update contest -- admin
exports.updateContest = catchAsyncErrors(async (req, res, next) => {
  let contest = await Contest.findById(req.params.id);

  if (!contest) {
    return next(new ErrorHander("Contest not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < contest.images.length; i++) {
      await cloudinary.v2.uploader.destroy(contest.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload_large(images[i], {
        folder: "contests",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    contest,
  });
});


// Get All Contest (Admin)
exports.getAdminContests = catchAsyncErrors(async (req, res, next) => {
  const contests = await Contest.find();
  res.status(200).json({
    success: true,
    contests,
  });
});
