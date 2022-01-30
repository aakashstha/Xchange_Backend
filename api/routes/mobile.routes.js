const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const Mobile = require("../models/mobile.model");

// To store any kind of files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // null is for error
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    // store current date-time as image name
    cb(null, Date.now() + "_" + file.originalname.split(" ").join("_"));
  },
});
const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png"
  ) {
    // store file with this extension
    cb(null, true);
  }
  {
    // reject a file with different extension
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  // fileFilter: fileFilter,
});

var uploadMultiple = upload.array("image", 8);

// For Posting Mobile Ad
router.post("/", uploadMultiple, async (req, res, next) => {
  const mobile = new Mobile({
    _id: new mongoose.Types.ObjectId(),
    brand: req.body.brand,
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });
  //console.log(req);

  try {
    const result = await mobile.save();
    res.status(201).json({
      message: "Mobile Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from Mobile Post method",
      error: err,
    });
  }
});

// For Getting All Mobile Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Mobile.find().exec();

    const response = {
      count: result.length,
      mobile: result,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from Mobile Get All method",
      error: err,
    });
  }
});

// For Getting One Mobile Ad
router.get("/:mobileId", async (req, res, next) => {
  const mobileId = req.params.mobileId;

  try {
    const result = await Mobile.findById(mobileId).exec();

    // if the courseId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      res.status(200).json({ mobile: result });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Mobile" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Mobile Get One method",
      error: err,
    });
  }
});

// For Updating One Mobile Ad
router.put("/:mobileId", async (req, res, next) => {
  const mobileId = req.params.mobileId;
  const updateOps = {
    brand: req.body.brand,
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Mobile.updateOne(
      { _id: mobileId },
      { $set: updateOps }
    ).exec();
    res
      .status(200)
      .json({ message: "Mobile Ad Updated Successfully", newAd: updateOps });
  } catch (err) {
    res.status(500).json({
      message: "Error from Mobile Update method",
      error: err,
    });
  }
});

// For Deleting One Mobile Ad
router.delete("/:mobileId", async (req, res, next) => {
  const mobileId = req.params.mobileId;

  try {
    const result = await Mobile.findByIdAndDelete(mobileId).exec();

    if (result) {
      res.status(200).json({ message: "Mobile Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Mobile" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Mobile Delete method",
      error: err,
    });
  }
});

module.exports = router;
