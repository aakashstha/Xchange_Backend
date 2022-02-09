const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Book } = require("../../models/products.model");
const { uploadImages, deleteImage } = require("../../middleware/upload-images");

// For Posting Book Ad
router.post("/", uploadImages, async (req, res, next) => {
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
    images: req.files.map((file) => file.path),
  });

  try {
    await book.save();
    res.status(201).json({
      message: "book Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from book Post method",
      error: err,
    });
  }
});

// For Getting All book Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Book.find().exec();

    const response = {
      count: result.length,
      book: result.map((doc) => {
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
      message: "Error from book Get All method",
      error: err,
    });
  }
});

// For Getting One book Ad
router.get("/:bookId", async (req, res, next) => {
  const bookId = req.params.bookId;

  try {
    const result = await Book.findById(bookId).exec();

    // if the bookId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        book: {
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
    res.status(404).json({ message: "No such ID exist in our book" });
  } catch (err) {
    res.status(500).json({
      message: "Error from book Get One method",
      error: err,
    });
  }
});

// For Updating One book Ad
router.put("/:bookId", uploadImages, async (req, res, next) => {
  const bookId = req.params.bookId;
  const updateOps = {
    price: req.body.price,
    adTitle: req.body.adTitle,
    description: req.body.description,
  };

  try {
    const result = await Book.findByIdAndUpdate(bookId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res
        .status(200)
        .json({ message: "book Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our book" });
  } catch (err) {
    res.status(500).json({
      message: "Error from book Update method",
      error: err,
    });
  }
});

// For Deleting One book Ad
router.delete("/:bookId", async (req, res, next) => {
  const bookId = req.params.bookId;
  deleteImage();

  try {
    const result = await Book.findByIdAndDelete(bookId).exec();

    if (result) {
      res.status(200).json({ message: "book Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our book" });
  } catch (err) {
    res.status(500).json({
      message: "Error from book Delete method",
      error: err,
    });
  }
});

module.exports = router;
