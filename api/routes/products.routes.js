const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const { Product } = require("../models/products.model");
const { uploadImages, deleteImage } = require("../middleware/handle-image");

// For Posting Product Ad
router.post("/", uploadImages, async (req, res, next) => {
  const product = new Product({
    // car, bike, mobile, book, service, electronic, musicInstruments
    brand: req.body.brand,
    price: req.body.price,
    year: req.body.year,
    kmDriven: req.body.kmDriven,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,

    // job
    salaryPeriod: req.body.salaryPeriod,
    positionType: req.body.positionType,
    salaryFrom: req.body.salaryFrom,
    salaryTo: req.body.salaryTo,

    // room
    totalRooms: req.body.totalRooms,
    kitchen: req.body.kitchen,
    toilet: req.body.toilet,
    waterSupply: req.body.waterSupply,

    // property
    type: req.body.type,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    furnishing: req.body.furnishing,
    listedBy: req.body.listedBy,
    totalFloors: req.body.totalFloors,
    area: req.body.area,
    facing: req.body.facing,
    images: req.files.map((file) => file.path),

    // must have field
    category: req.body.category,
    userId: req.body.userId,
  });

  try {
    await product.save();
    res.status(201).json({
      message: "Product Ad Created Successfully",
      imagesArray: req.files.map((file) => file.path),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from product Post method",
      error: err,
    });
  }
});

// For Getting All Product Ads
router.get("/", async (req, res, next) => {
  try {
    const result = await Product.find().exec();

    const response = {
      count: result.length,
      products: result.map((doc) => {
        return {
          // car, bike, mobile, book, service, electronic, musicInstruments
          _id: doc._id,
          brand: doc.brand,
          price: doc.price,
          year: doc.year,
          kmDriven: doc.kmDriven,
          adTitle: doc.adTitle,
          description: doc.description,
          date: doc.date,
          location: doc.location,

          // job
          salaryPeriod: doc.salaryPeriod,
          positionType: doc.positionType,
          salaryFrom: doc.salaryFrom,
          salaryTo: doc.salaryTo,

          // room
          totalRooms: doc.totalRooms,
          kitchen: doc.kitchen,
          toilet: doc.toilet,
          waterSupply: doc.waterSupply,

          // property
          type: doc.type,
          bedrooms: doc.bedrooms,
          bathrooms: doc.bathrooms,
          furnishing: doc.furnishing,
          listedBy: doc.listedBy,
          totalFloors: doc.totalFloors,
          area: doc.area,
          facing: doc.facing,
          images: doc.images,

          // must have field
          category: doc.category,
          userId: doc.userId,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from product Get All method",
      error: err,
    });
  }
});

// For Getting One Product Ad
router.get("/:productId", async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const result = await Product.findById(productId).exec();

    // if the productId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        products: {
          // car, bike, mobile, book, service, electronic, musicInstruments
          _id: result._id,
          brand: result.brand,
          price: result.price,
          year: result.year,
          kmDriven: result.kmDriven,
          adTitle: result.adTitle,
          description: result.description,
          date: result.date,
          location: result.location,

          // job
          salaryPeriod: result.salaryPeriod,
          positionType: result.positionType,
          salaryFrom: result.salaryFrom,
          salaryTo: result.salaryTo,

          // room
          totalRooms: result.totalRooms,
          kitchen: result.kitchen,
          toilet: result.toilet,
          waterSupply: result.waterSupply,

          // property
          type: result.type,
          bedrooms: result.bedrooms,
          bathrooms: result.bathrooms,
          furnishing: result.furnishing,
          listedBy: result.listedBy,
          totalFloors: result.totalFloors,
          area: result.area,
          facing: result.facing,
          images: result.images,

          // must have field
          category: result.category,
          userId: result.userId,
        },
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our product" });
  } catch (err) {
    res.status(500).json({
      message: "Error from product Get One method",
      error: err,
    });
  }
});

// For Updating One product Ad
router.put("/:productId", uploadImages, async (req, res, next) => {
  const productId = req.params.productId;
  const updateOps = {
    // car, bike, mobile, book, service, electronic, musicInstruments
    brand: req.body.brand,
    price: req.body.price,
    year: req.body.year,
    kmDriven: req.body.kmDriven,
    adTitle: req.body.adTitle,
    description: req.body.description,
    location: req.body.location,

    // job
    salaryPeriod: req.body.salaryPeriod,
    positionType: req.body.positionType,
    salaryFrom: req.body.salaryFrom,
    salaryTo: req.body.salaryTo,

    // room
    totalRooms: req.body.totalRooms,
    kitchen: req.body.kitchen,
    toilet: req.body.toilet,
    waterSupply: req.body.waterSupply,

    // property
    type: req.body.type,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    furnishing: req.body.furnishing,
    listedBy: req.body.listedBy,
    totalFloors: req.body.totalFloors,
    area: req.body.area,
    facing: req.body.facing,
    images: req.files.map((file) => file.path),

    // must have field
    category: req.body.category,
    userId: req.body.userId,
  };

  try {
    const result = await Product.findByIdAndUpdate(productId, {
      $set: updateOps,
    }).exec();

    if (result) {
      await deleteImage(result.images);
      res
        .status(200)
        .json({ message: "product Ad Updated Successfully", newAd: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our product" });
  } catch (err) {
    res.status(500).json({
      message: "Error from product Update method",
      error: err,
    });
  }
});

// For Deleting One product Ad
router.delete("/:productId", async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const result = await Product.findByIdAndDelete(productId).exec();

    if (result) {
      await deleteImage(result.images);

      res.status(200).json({ message: "product Ad Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our product" });
  } catch (err) {
    res.status(500).json({
      message: "Error from product Delete method",
      error: err,
    });
  }
});

/*








 */

// For Getting categorical Ad
router.get("/categorical/:category", async (req, res, next) => {
  const category = req.params.category;

  try {
    const result = await Product.find({ category: category }).exec();
    // console.log(result[0]["category"]);
    var name = "name";

    const response = {
      count: result.length,
      products: result.map((doc) => {
        return {
          // car, bike, mobile, book, service, electronic, musicInstruments
          _id: doc._id,
          brand: doc.brand,
          price: doc.price,
          year: doc.year,
          kmDriven: doc.kmDriven,
          adTitle: doc.adTitle,
          description: doc.description,
          date: doc.date,
          location: doc.location,

          // job
          salaryPeriod: doc.salaryPeriod,
          positionType: doc.positionType,
          salaryFrom: doc.salaryFrom,
          salaryTo: doc.salaryTo,

          // room
          totalRooms: doc.totalRooms,
          kitchen: doc.kitchen,
          toilet: doc.toilet,
          waterSupply: doc.waterSupply,

          // property
          type: doc.type,
          bedrooms: doc.bedrooms,
          bathrooms: doc.bathrooms,
          furnishing: doc.furnishing,
          listedBy: doc.listedBy,
          totalFloors: doc.totalFloors,
          area: doc.area,
          facing: doc.facing,
          images: doc.images,

          // must have field
          category: doc.category,
          userId: doc.userId,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from product Get categorical All method",
      error: err,
    });
  }
});

// For Getting user specific Ad
router.get("/user/:userId", async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const result = await Product.find({ userId: userId }).exec();
    // console.log(result[0]["category"]);
    var name = "name";

    const response = {
      count: result.length,
      products: result.map((doc) => {
        return {
          // car, bike, mobile, book, service, electronic, musicInstruments
          _id: doc._id,
          brand: doc.brand,
          price: doc.price,
          year: doc.year,
          kmDriven: doc.kmDriven,
          adTitle: doc.adTitle,
          description: doc.description,
          date: doc.date,
          location: doc.location,

          // job
          salaryPeriod: doc.salaryPeriod,
          positionType: doc.positionType,
          salaryFrom: doc.salaryFrom,
          salaryTo: doc.salaryTo,

          // room
          totalRooms: doc.totalRooms,
          kitchen: doc.kitchen,
          toilet: doc.toilet,
          waterSupply: doc.waterSupply,

          // property
          type: doc.type,
          bedrooms: doc.bedrooms,
          bathrooms: doc.bathrooms,
          furnishing: doc.furnishing,
          listedBy: doc.listedBy,
          totalFloors: doc.totalFloors,
          area: doc.area,
          facing: doc.facing,
          images: doc.images,

          // must have field
          category: doc.category,
          userId: doc.userId,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error from product Get User specific All method",
      error: err,
    });
  }
});

/*









 */

// For Getting Recommendation from Python
router.post("/recommendation/python", async (req, res, next) => {
  console.log(req.body.adId);

  try {
    var response = await fetch(
      "http://127.0.0.1:8001/predict/" + req.body.adId
    );
    const result = await response.json();
    console.log(result.id);

    // for getting data from mongodb after recommendation provide by python module
    const findProduct = await Product.find({
      _id: {
        $in: [
          result.id[0],
          result.id[1],
          result.id[2],
          result.id[3],
          // mongoose.Types.ObjectId(result.id[0]),
        ],
      },
    }).exec();
    console.log(findProduct[0].adTitle);
    console.log(findProduct[1].adTitle);
    console.log(findProduct[2].adTitle);
    console.log(findProduct[3].adTitle);

    // for (let index = 0; index < result.id.length; index++) {
    //   console.log(findProduct[index].adTitle);
    // }

    res.status(200).json({
      message: "Recommendation from Python",
      count: findProduct.length,
      recommendedProduct: findProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from product Post Recommendation method",
      error: err,
    });
  }
});

// For Getting Recommendation from Python
router.get("/search/:key", async (req, res, next) => {
  const key = req.params.key;

  try {
    const result = await Product.find({
      $or: [
        { adTitle: { $regex: key, $options: "i" } },
        { brand: { $regex: key, $options: "i" } },
        { description: { $regex: key, $options: "i" } },
      ],
    }).exec();

    res.status(200).json({
      count: result.length,
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error from searching ",
      error: err,
    });
  }
});

module.exports = router;
