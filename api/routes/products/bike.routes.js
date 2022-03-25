const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Bike } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/handle-image");

// For Posting bike Ad
router.post("/", uploadImages, async (req, res, next) => {
  const bike = new Bike({
    brand: req.body.brand,
    price: req.body.price,
    year: req.body.year,
    kmDriven: req.body.kmDriven,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,
    images: req.files.map((file) => file.path),
  });

  try {
    await bike.save();
    res.status(201).json({
      message: "bike Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from bike Post method",
      error: err,
    });
  }
});

// For Getting All bike Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Bike.find().exec();

    const response = {
      count: result.length,
      bikes: result.map((doc) => {
        return {
          _id: doc._id,
          brand: doc.brand,
          price: doc.price,
          year: doc.year,
          kmDriven: doc.kmDriven,
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
      message: "Error from bike Get All method",
      error: err,
    });
  }
});

// For Getting One bike Ad
router.get("/:bikeId", async (req, res, next) => {
  const bikeId = req.params.bikeId;

  try {
    const result = await Bike.findById(bikeId).exec();

    // if the bikeId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        bikes: {
          _id: result._id,
          brand: result.brand,
          price: result.price,
          year: result.year,
          kmDriven: result.kmDriven,
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
    res.status(404).json({ message: "No such ID exist in our bike" });
  } catch (err) {
    res.status(500).json({
      message: "Error from bike Get One method",
      error: err,
    });
  }
});

// For Updating One bike Ad
router.put("/:bikeId", uploadImages, async (req, res, next) => {
  const bikeId = req.params.bikeId;
  const updateOps = {
    brand: req.body.brand,
    price: req.body.price,
    year: req.body.year,
    kmDriven: req.body.kmDriven,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,
    images: req.files.map((file) => file.path),
  };

  try {
    const result = await Bike.findByIdAndUpdate(bikeId, {
      $set: updateOps,
    }).exec();

    if (result) {
      await deleteImage(result.images);
      res
        .status(200)
        .json({ message: "bike Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our bike" });
  } catch (err) {
    res.status(500).json({
      message: "Error from bike Update method",
      error: err,
    });
  }
});

// For Deleting One bike Ad
router.delete("/:bikeId", async (req, res, next) => {
  const bikeId = req.params.bikeId;

  try {
    const result = await Bike.findByIdAndDelete(bikeId).exec();

    if (result) {
      await deleteImage(result.images);
      res.status(200).json({ message: "bike Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our bike" });
  } catch (err) {
    res.status(500).json({
      message: "Error from bike Delete method",
      error: err,
    });
  }
});

module.exports = router;
