const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const User = require("../models/user.model");
const checkAuth = require("../middleware/check-auth");
const nodeMailer = require("../middleware/node-mailer");

// For Posting User SignUp Data
router.post("/signup", async (req, res, next) => {
  try {
    const result = await User.find({ email: req.body.email }).exec();

    if (result.length >= 1) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const token = jwt.sign({ email: req.body.email }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      if (err) {
        return res.status(500).json({
          message: "Error from User Post SignUp method 1",
          error: err,
        });
      }
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        email: req.body.email,
        password: hash,
        confirmationCode: token,
      });
      const savedResult = await user.save();

      // To Send Email
      if (savedResult) {
        await nodeMailer.email(req, res);
      }

      res.status(201).json({
        message: "User Created",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from User Post SignUp method 2",
      error: err,
    });
  }
});

// For Posting User Login Data
router.post("/login", async (req, res, next) => {
  try {
    const user_result = await User.find({ email: req.body.email }).exec();

    if (user_result.length < 1) {
      return res.status(401).json({
        message: "Auth Failed",
      });
    }

    if (user_result[0].confirmed) {
      console.log(user_result);
    }

    // because find() method above return list of object so here we need to do user[0].password
    bcrypt.compare(
      req.body.password,
      user_result[0].password,
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
              email: user_result[0].email,
              userId: user_result[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "10h",
            }
          );
          return res.status(200).json({
            id: user_result[0]._id,
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
      message: "Error from User Post LogIn method",
      error: error,
    });
  }
});

// For Deleting User Data
router.delete("/:userId", checkAuth, async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const result = await User.findByIdAndDelete({ _id: userId }).exec();

    if (result) {
      res.status(200).json({ message: "User Deleted Successfully" });
      return;
    }
    res.status(404).json({ message: "No such ID exist in User section" });
  } catch (error) {
    res.status(500).json({
      message: "Error from User Delete method",
      error: error,
    });
  }
});

module.exports = router;
