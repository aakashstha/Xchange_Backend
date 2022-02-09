const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { MusicInstrument } = require("../../models/products.model");
const uploadImages = require("../../middleware/upload-images");

// For Posting musical_Instrument Ad
router.post("/", uploadImages, async (req, res, next) => {
  const musical_Instrument = new MusicInstrument({
    _id: new mongoose.Types.ObjectId(),
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await musical_Instrument.save();
    res.status(201).json({
      message: "musical_Instrument Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from musical_Instrument Post method",
      error: err,
    });
  }
});

// For Getting All musical_Instrument Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await MusicInstrument.find().exec();

    const response = {
      count: result.length,
      musical_Instrument: result.map((doc) => {
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
      message: "Error from musical_Instrument Get All method",
      error: err,
    });
  }
});

// For Getting One musical_Instrument Ad
router.get("/:musical_InstrumentId", async (req, res, next) => {
  const musical_InstrumentId = req.params.musical_InstrumentId;

  try {
    const result = await MusicInstrument.findById(musical_InstrumentId).exec();

    // if the musical_InstrumentId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        musical_Instrument: {
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
    res
      .status(404)
      .json({ message: "No such ID exist in our musical_Instrument" });
  } catch (err) {
    res.status(500).json({
      message: "Error from musical_Instrument Get One method",
      error: err,
    });
  }
});

// For Updating One musical_Instrument Ad
router.put("/:musical_InstrumentId", uploadImages, async (req, res, next) => {
  const musical_InstrumentId = req.params.musical_InstrumentId;
  const updateOps = {
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await MusicInstrument.findByIdAndUpdate(
      musical_InstrumentId,
      {
        $set: updateOps,
      }
    ).exec();

    if (result) {
      res.status(200).json({
        message: "musical_Instrument Ad Updated Successfully",
        newAd: updateOps,
      });
      return;
    }
    res
      .status(404)
      .json({ message: "No such ID exist in our musical_Instrument" });
  } catch (err) {
    res.status(500).json({
      message: "Error from musical_Instrument Update method",
      error: err,
    });
  }
});

// For Deleting One musical_Instrument Ad
router.delete("/:musical_InstrumentId", async (req, res, next) => {
  const musical_InstrumentId = req.params.musical_InstrumentId;

  try {
    const result = await MusicInstrument.findByIdAndDelete(
      musical_InstrumentId
    ).exec();

    if (result) {
      res
        .status(200)
        .json({ message: "musical_Instrument Ad Deleted Successfully" });
      return;
    }
    res
      .status(404)
      .json({ message: "No such ID exist in our musical_Instrument" });
  } catch (err) {
    res.status(500).json({
      message: "Error from musical_Instrument Delete method",
      error: err,
    });
  }
});

module.exports = router;
