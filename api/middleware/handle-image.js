const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Saving on Cloud Info
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
    public_id: (req, file) => {
      return Date.now();
      //+ "_" + file.originalname.split(" ").join("_");
    },
  },
});

const fileFilter = (req, file, cb) => {
  // console.log(file);
  // if (
  //   file.mimetype == "image/jpg" ||
  //   file.mimetype == "image/jpeg" ||
  //   file.mimetype == "image/png"
  // ) {
  // store file with this extension
  cb(null, true);
  // } else {
  //   // reject a file with different extension
  //   cb(null, false);
  //   return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  // }
};

const uploadImages = multer({
  storage: cloudStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
}).array("image", 8);

// To delete Images from Cloudinary
const deleteImage = async (imagesURL) => {
  //console.log("!!!!!!!!!!!!!!!!! " + imagesURL);
  if (imagesURL.length > 0) {
    let allImage = [];
    imagesURL.forEach((imagePath) => {
      allImage.push(imagePath.substring(62, 79));
    });

    await cloudinary.api.delete_resources(allImage, function (err, result) {
      if (err) {
        console.log("Error from Image Delete ", err);
      }
      console.log("Image Deleted Successfully");
    });
  } else {
    console.log("No Image to Delete");
  }
};

module.exports = { uploadImages, deleteImage };
