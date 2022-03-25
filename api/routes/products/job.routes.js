const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Job } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/handle-image");

// For Posting job Ad
router.post("/", uploadImages, async (req, res, next) => {
  const job = new Job({
    salaryPeriod: req.body.salaryPeriod,
    positionType: req.body.positionType,
    salaryFrom: req.body.salaryFrom,
    salaryTo: req.body.salaryTo,
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,
    images: req.files.map((file) => file.path),
  });

  try {
    await job.save();
    res.status(201).json({
      message: "job Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from job Post method",
      error: err,
    });
  }
});

// For Getting All job Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Job.find().exec();

    const response = {
      count: result.length,
      jobs: result.map((doc) => {
        return {
          _id: doc._id,
          salaryPeriod: doc.salaryPeriod,
          positionType: doc.positionType,
          salaryFrom: doc.salaryFrom,
          salaryTo: doc.salaryTo,
          price: doc.price,
          adTitle: doc.adTitle,
          description: doc.description,
          location: doc.location,
          date: doc.date,
          images: doc.images,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from job Get All method",
      error: err,
    });
  }
});

// For Getting One job Ad
router.get("/:jobId", async (req, res, next) => {
  const jobId = req.params.jobId;

  try {
    const result = await Job.findById(jobId).exec();

    // if the jobId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        jobs: {
          _id: result._id,
          salaryPeriod: result.salaryPeriod,
          positionType: result.positionType,
          salaryFrom: result.salaryFrom,
          salaryTo: result.salaryTo,
          price: result.price,
          adTitle: result.adTitle,
          description: result.description,
          location: result.location,
          date: result.date,
          images: result.images,
        },
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our job" });
  } catch (err) {
    res.status(500).json({
      message: "Error from job Get One method",
      error: err,
    }); 
  }
});

// For Updating One job Ad
router.put("/:jobId", uploadImages, async (req, res, next) => {
  const jobId = req.params.jobId;
  const updateOps = {
    salaryPeriod: req.body.salaryPeriod,
    positionType: req.body.positionType,
    salaryFrom: req.body.salaryFrom,
    salaryTo: req.body.salaryTo,
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,
    images: req.files.map((file) => file.path),
  };

  try {
    const result = await Job.findByIdAndUpdate(jobId, {
      $set: updateOps,
    }).exec();

    if (result) {
      await deleteImage(result.images);
      res
        .status(200)
        .json({ message: "job Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our job" });
  } catch (err) {
    res.status(500).json({
      message: "Error from job Update method",
      error: err,
    });
  }
});

// For Deleting One job Ad
router.delete("/:jobId", async (req, res, next) => {
  const jobId = req.params.jobId;

  try {
    const result = await Job.findByIdAndDelete(jobId).exec();

    if (result) {
      await deleteImage(result.images);
      res.status(200).json({ message: "job Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our job" });
  } catch (err) {
    res.status(500).json({
      message: "Error from job Delete method",
      error: err,
    });
  }
});

module.exports = router;
