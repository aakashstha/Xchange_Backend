const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

const Mobile = require("../models/mobile.model");
const { upload, deleteImage } = require("../middleware/upload-images");

// For Posting Mobile Ad
router.post("/", upload, async (req, res, next) => {
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
      mobile: result.map((doc) => {
        return {
          _id: doc._id,
          brand: doc.brand,
          price: doc.price,
          adTitle: doc.adTitle,
          description: doc.description,
          images: doc.images,
        };
      }),
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
      const response = {
        mobile: {
          _id: result._id,
          brand: result.brand,
          price: result.price,
          adTitle: result.adTitle,
          description: result.description,
          images: result.images,
        },
      };
      res.status(200).json(response);
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
  deleteImage();
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
