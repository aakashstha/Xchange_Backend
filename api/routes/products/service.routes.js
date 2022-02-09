const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Service } = require("../../models/products.model");
const uploadImages = require("../../middleware/upload-images");

// For Posting service Ad
router.post("/", uploadImages, async (req, res, next) => {
  const service = new Service({
    _id: new mongoose.Types.ObjectId(),
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await service.save();
    res.status(201).json({
      message: "Service Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from Service Post method",
      error: err,
    });
  }
});

// For Getting All Service Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Service.find().exec();

    const response = {
      count: result.length,
      service: result.map((doc) => {
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
      message: "Error from Service Get All method",
      error: err,
    });
  }
});

// For Getting One Service Ad
router.get("/:serviceId", async (req, res, next) => {
  const serviceId = req.params.serviceId;

  try {
    const result = await Service.findById(serviceId).exec();

    // if the serviceId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        service: {
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
    res.status(404).json({ message: "No such ID exist in our Service" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Service Get One method",
      error: err,
    });
  }
});

// For Updating One Service Ad
router.put("/:serviceId", uploadImages, async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const updateOps = {
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Service.findByIdAndUpdate(serviceId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res
        .status(200)
        .json({ message: "Service Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Service" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Service Update method",
      error: err,
    });
  }
});

// For Deleting One Service Ad
router.delete("/:serviceId", async (req, res, next) => {
  const serviceId = req.params.serviceId;

  try {
    const result = await Service.findByIdAndDelete(serviceId).exec();

    if (result) {
      res.status(200).json({ message: "Service Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our Service" });
  } catch (err) {
    res.status(500).json({
      message: "Error from Service Delete method",
      error: err,
    });
  }
});

module.exports = router;
