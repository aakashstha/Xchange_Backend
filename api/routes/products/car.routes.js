const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Car } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/handle-image");

// For Posting Car Ad
router.post("/", uploadImages, async (req, res, next) => {
  console.log(req);
  return;
  const car = new Car({
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
    await car.save();
    res.status(201).json({
      message: "Car Ad Created Successfully",
      // imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from Car Post method",
      error: err,
    });
  }
});

// For Getting All Car Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Car.find().exec();

    const response = {
      count: result.length,
      cars: result.map((doc) => {
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
      message: "Error from Car Get All method",
      error: err,
    });
  }
});

// For Getting One Car Ad
router.get("/:carId", async (req, res, next) => {
  const carId = req.params.carId;

  try {
    const result = await Car.findById(carId).exec();

    // if the carId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        cars: {
          _id: result._id,
          brand: result.brand,
          price: result.price,
          fuel: result.fuel,
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
    res.status(404).json({ message: "No such ID exist in our car" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Car Get One method",
      error: err,
    });
  }
});

// For Updating One Car Ad
router.put("/:carId", uploadImages, async (req, res, next) => {
  const carId = req.params.carId;
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
    const result = await Car.findByIdAndUpdate(carId, {
      $set: updateOps,
    }).exec();

    if (result) {
      await deleteImage(result.images);
      res
        .status(200)
        .json({ message: "Car Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Car" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Car Update method",
      error: err,
    });
  }
});

// For Deleting One Car Ad
router.delete("/:carId", async (req, res, next) => {
  const carId = req.params.carId;

  try {
    const result = await Car.findByIdAndDelete(carId).exec();

    if (result) {
      await deleteImage(result.images);
      res.status(200).json({ message: "Car Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Car" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Car Delete method",
      error: err,
    });
  }
});

module.exports = router;
