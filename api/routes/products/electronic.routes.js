const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Electronic } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/upload-images");

// For Posting electronic Ad
router.post("/", uploadImages, async (req, res, next) => {
  const electronic = new Electronic({
    _id: new mongoose.Types.ObjectId(),
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await electronic.save();
    res.status(201).json({
      message: "electronic Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from electronic Post method",
      error: err,
    });
  }
});

// For Getting All electronic Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Electronic.find().exec();

    const response = {
      count: result.length,
      electronic: result.map((doc) => {
        return {
          _id: doc._id,
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
      message: "Error from electronic Get All method",
      error: err,
    });
  }
});

// For Getting One electronic Ad
router.get("/:electronicId", async (req, res, next) => {
  const electronicId = req.params.electronicId;

  try {
    const result = await Electronic.findById(electronicId).exec();

    // if the electronicId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        electronic: {
          _id: result._id,
          price: result.price,
          adTitle: result.adTitle,
          description: result.description,
          images: result.images,
        },
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our electronic" });
  } catch (err) {
    res.status(500).json({
      message: "Error from electronic Get One method",
      error: err,
    });
  }
});

// For Updating One electronic Ad
router.put("/:electronicId", uploadImages, async (req, res, next) => {
  const electronicId = req.params.electronicId;
  const updateOps = {
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Electronic.findByIdAndUpdate(electronicId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res.status(200).json({
        message: "electronic Ad Updated Successfully",
        newAd: updateOps,
      });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our electronic" });
  } catch (err) {
    res.status(500).json({
      message: "Error from electronic Update method",
      error: err,
    });
  }
});

// For Deleting One electronic Ad
router.delete("/:electronicId", async (req, res, next) => {
  const electronicId = req.params.electronicId;
  deleteImage();

  try {
    const result = await Electronic.findByIdAndDelete(electronicId).exec();

    if (result) {
      res.status(200).json({ message: "electronic Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our electronic" });
  } catch (err) {
    res.status(500).json({
      message: "Error from electronic Delete method",
      error: err,
    });
  }
});

module.exports = router;
