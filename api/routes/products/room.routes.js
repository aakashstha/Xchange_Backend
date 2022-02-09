const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Room } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/upload-images");

// For Posting room Ad
router.post("/", uploadImages, async (req, res, next) => {
  const room = new Room({
    _id: new mongoose.Types.ObjectId(),
    totalRooms: req.body.totalRooms,
    kitchen: req.body.kitchen,
    toilet: req.body.toilet,
    waterSupply: req.body.waterSupply,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await room.save();
    res.status(201).json({
      message: "room Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from room Post method",
      error: err,
    });
  }
});

// For Getting All room Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Room.find().exec();

    const response = {
      count: result.length,
      room: result.map((doc) => {
        return {
          _id: doc._id,
          totalRooms: doc.totalRooms,
          kitchen: doc.kitchen,
          toilet: doc.toilet,
          waterSupply: doc.waterSupply,
          adTitle: doc.adTitle,
          description: doc.description,
          images: doc.images,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from room Get All method",
      error: err,
    });
  }
});

// For Getting One room Ad
router.get("/:roomId", async (req, res, next) => {
  const roomId = req.params.roomId;

  try {
    const result = await Room.findById(roomId).exec();

    // if the roomId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        room: {
          _id: result._id,
          totalRooms: result.totalRooms,
          kitchen: result.kitchen,
          toilet: result.toilet,
          waterSupply: result.waterSupply,
          adTitle: result.adTitle,
          description: result.description,
          images: result.images,
        },
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our room" });
  } catch (err) {
    res.status(500).json({
      message: "Error from room Get One method",
      error: err,
    });
  }
});

// For Updating One room Ad
router.put("/:roomId", uploadImages, async (req, res, next) => {
  const roomId = req.params.roomId;
  const updateOps = {
    totalRooms: req.body.totalRooms,
    kitchen: req.body.kitchen,
    toilet: req.body.toilet,
    waterSupply: req.body.waterSupply,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Room.findByIdAndUpdate(roomId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res
        .status(200)
        .json({ message: "room Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our room" });
  } catch (err) {
    res.status(500).json({
      message: "Error from room Update method",
      error: err,
    });
  }
});

// For Deleting One room Ad
router.delete("/:roomId", async (req, res, next) => {
  const roomId = req.params.roomId;
  deleteImage();

  try {
    const result = await Room.findByIdAndDelete(roomId).exec();

    if (result) {
      res.status(200).json({ message: "room Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our room" });
  } catch (err) {
    res.status(500).json({
      message: "Error from room Delete method",
      error: err,
    });
  }
});

module.exports = router;
