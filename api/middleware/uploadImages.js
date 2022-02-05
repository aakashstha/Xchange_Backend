const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Saving on Cloud Info
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
    public_id: (req, file) => {
      return Date.now() + "_" + file.originalname.split(" ").join("_");
    },
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png"
  ) {
    // store file with this extension
    cb(null, true);
  }
  {
    // reject a file with different extension
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  //fileFilter: fileFilter,
});

module.exports = upload.array("image", 8);
