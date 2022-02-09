const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Property } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/upload-images");

// For Posting property Ad
router.post("/", uploadImages, async (req, res, next) => {
  const property = new Property({
    _id: new mongoose.Types.ObjectId(),
    type: req.body.type,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    furnishing: req.body.furnishing,
    listedBy: req.body.listedBy,
    totalFloors: req.body.totalFloors,
    area: req.body.area,
    facing: req.body.facing,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await property.save();
    res.status(201).json({
      message: "property Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from property Post method",
      error: err,
    });
  }
});

// For Getting All property Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Property.find().exec();

    const response = {
      count: result.length,
      property: result.map((doc) => {
        return {
          _id: doc._id,
          type: doc.type,
          bedrooms: doc.bedrooms,
          bathrooms: doc.bathrooms,
          furnishing: doc.furnishing,
          listedBy: doc.listedBy,
          totalFloors: doc.totalFloors,
          area: doc.area,
          facing: doc.facing,
          adTitle: doc.adTitle,
          description: doc.description,
          images: doc.images,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from property Get All method",
      error: err,
    });
  }
});

// For Getting One property Ad
router.get("/:propertyId", async (req, res, next) => {
  const propertyId = req.params.propertyId;

  try {
    const result = await Property.findById(propertyId).exec();

    // if the propertyId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        property: {
          _id: result._id,
          type: result.type,
          bedrooms: result.bedrooms,
          bathrooms: result.bathrooms,
          furnishing: result.furnishing,
          listedBy: result.listedBy,
          totalFloors: result.totalFloors,
          area: result.area,
          facing: result.facing,
          adTitle: result.adTitle,
          description: result.description,
          images: result.images,
        },
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our property" });
  } catch (err) {
    res.status(500).json({
      message: "Error from property Get One method",
      error: err,
    });
  }
});

// For Updating One property Ad
router.put("/:propertyId", uploadImages, async (req, res, next) => {
  const propertyId = req.params.propertyId;
  const updateOps = {
    type: req.body.type,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    furnishing: req.body.furnishing,
    listedBy: req.body.listedBy,
    totalFloors: req.body.totalFloors,
    area: req.body.area,
    facing: req.body.facing,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Property.findByIdAndUpdate(propertyId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res.status(200).json({
        message: "property Ad Updated Successfully",
        newAd: updateOps,
      });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our property" });
  } catch (err) {
    res.status(500).json({
      message: "Error from property Update method",
      error: err,
    });
  }
});

// For Deleting One property Ad
router.delete("/:propertyId", async (req, res, next) => {
  const propertyId = req.params.propertyId;
  deleteImage();

  try {
    const result = await Property.findByIdAndDelete(propertyId).exec();

    if (result) {
      res.status(200).json({ message: "property Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our property" });
  } catch (err) {
    res.status(500).json({
      message: "Error from property Delete method",
      error: err,
    });
  }
});

module.exports = router;
