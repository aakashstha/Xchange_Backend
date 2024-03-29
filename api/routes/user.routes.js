const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const { Product } = require("../models/products.model");
const checkAuth = require("../middleware/check-auth");
const nodeMailer = require("../middleware/node-mailer");

// For Posting User SignUp Data
router.post("/signup", async (req, res, next) => {
  try {
    // Get user input
    const { fullName, email, password } = req.body;

    // Validate user input
    if (!(fullName && email && password)) {
      res
        .status(400)
        .send("All input is required like fullName, email and password");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.find({ email: req.body.email }).exec();
    // console.log(oldUser);

    if (oldUser.length >= 1) {
      return res.status(409).json({
        message: "User Already Exists. Please Login",
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
        fullName: req.body.fullName,
        email: req.body.email,
        dob: req.body.dob,
        bio: req.body.bio,
        website: req.body.website,
        gender: req.body.gender,
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
            message: "Auth successful",
            id: user_result[0]._id,
            email: user_result[0].email,
            gender: user_result[0].gender,
            confirm: user_result[0].confirmed,
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
    const result1 = await Product.deleteMany({ userId: userId }).exec();
    // console.log(result1);

    if (result) {
      res
        .status(200)
        .json({ message: "User Deleted Successfully and all his product" });
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

// For Getting One User Data
router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const result = await User.findOne({ _id: userId }).exec();

    // if the userId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      const response = {
        _id: result._id,
        fullName: result.fullName,
        email: result.email,
        password: result.password,
        dob: result.dob,
        bio: result.bio,
        website: result.website,
        gender: result.gender,
        confirmed: result.confirmed,
        confirmationCode: result.confirmationCode,
        dateCreated: result.dateCreated,
      };
      res.status(200).json(response);
      return;
    }
    res.status(404).json({ message: "No such ID exist in our User" });
  } catch (err) {
    res.status(500).json({
      message: "Error from User Get One method",
      error: err,
    });
  }
});

// For Updating User Password
router.put("/change_password", async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const user_result = await User.findById(userId).exec();

    var passwordMatched = await bcrypt.compare(
      req.body.oldPassword,
      user_result["password"]
    );

    if (passwordMatched) {
      bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: "Error from User Change Password method 1",
            error: err,
          });
        }

        const updateOps = {
          password: hash,
        };
        const result = await User.findByIdAndUpdate(userId, {
          $set: updateOps,
        }).exec();

        if (result) {
          res.status(200).json({ message: "password Changed successfully" });
          return;
        }
        res.status(404).json({ message: "No such ID exist in our User" });
      });
    } else {
      res.status(401).json({ message: "Your old password did not mactched" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error from User Change password",
      error: err,
    });
  }
});

// For Resetting User Password
router.put("/reset_password", async (req, res, next) => {
  try {
    const email = req.body.email;
    const user_result = await User.find({ email: email }).exec();
    console.log(user_result);

    if (user_result.length >= 1) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: "Error from User Reset Password method 1",
            error: err,
          });
        }

        const updateOps = {
          password: hash,
          confirmed: false,
        };
        const result = await User.findByIdAndUpdate(user_result[0]._id, {
          $set: updateOps,
        }).exec();

        if (result) {
          // To Send Email
          await nodeMailer.email(req, res);

          res.status(200).json({ message: "password Reset successfully" });
          return;
        }
        res.status(404).json({ message: "No such ID exist in our User" });
      });
    } else {
      res.status(401).json({ message: "NO any result" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error from User Reset password",
      error: err,
    });
  }
});

// For Updating User email
router.put("/change_email", async (req, res, next) => {
  const userId = req.body.userId;

  const updateOps = {
    email: req.body.email,
    confirmed: false,
  };

  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: updateOps,
    }).exec();

    if (result) {
      // To Send Email
      await nodeMailer.email(req, res);

      res
        .status(200)
        .json({ message: "User Email Updated Successfully", user: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our User" });
  } catch (err) {
    res.status(500).json({
      message: "Error from User Update Email method",
      error: err,
    });
  }
});

// For Updating One User Data
router.put("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const updateOps = {
    fullName: req.body.fullName,
    dob: req.body.dob,
    bio: req.body.bio,
    gender: req.body.gender,
    website: req.body.website,
  };

  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: updateOps,
    }).exec();

    if (result) {
      res
        .status(200)
        .json({ message: "User Updated Successfully", user: updateOps });
      return;
    }
    res.status(404).json({ message: "No such ID exist in our User" });
  } catch (err) {
    res.status(500).json({
      message: "Error from User Update method",
      error: err,
    });
  }
});

module.exports = router;
