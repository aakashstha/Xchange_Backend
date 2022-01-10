const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
//const checkAuth = require("../middleware/check-auth");

// For Posting Admin SignUp Data
router.post("/signup", async (req, res, next) => {
  try {
    const result = await Admin.find({ email: req.body.email }).exec();

    if (result.length >= 1) {
      return res.status(409).json({
        message: "Admin Already Exists",
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Error from Admin Post SignUp method 1",
          error: err,
        });
      }
      const admin = new Admin({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });
      await admin.save();

      res.status(201).json({
        message: "Admin Created",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from Admin Post SignUp method 2",
      error: err,
    });
  }
});

// For Posting Admin LogIn Data
router.post("/login", async (req, res, next) => {
  try {
    const admin_result = await Admin.find({ email: req.body.email }).exec();

    if (admin_result.length < 1) {
      return res.status(401).json({
        message: "Auth Failed",
      });
    }

    // because find() method above return list of object so here we need to do admin[0].password
    bcrypt.compare(
      req.body.password,
      admin_result[0].password,
      (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed 1",
          });
        }
        if (result) {
          // JWT web token
          const token = jwt.sign(
            {
              email: admin_result[0].email,
              userId: admin_result[0]._id,
            },
            "secretJWT",
            {
              expiresIn: "10h",
            }
          );
          return res.status(200).json({
            id: admin_result[0]._id,
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed 2",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Error from Admin Post LogIn method",
      error: error,
    });
  }
});

// For Deleting Admin Data
router.delete("/:adminId", async (req, res, next) => {
  const adminId = req.params.adminId;

  try {
    await Admin.deleteOne({ _id: adminId }).exec();

    res.status(200).json({
      message: "Admin Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from Admin Delete method",
      error: error,
    });
  }
});

module.exports = router;
