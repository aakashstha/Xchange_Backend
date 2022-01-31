const multer = require("multer");

// To store any kind of files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // null is for error
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    // store current date-time as image name
    cb(null, Date.now() + "_" + file.originalname.split(" ").join("_"));
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
  // fileFilter: fileFilter,
});

module.exports = upload.array("image", 8);
