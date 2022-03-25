const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const User = require("../models/user.model");

//
// Send email to verify from nodemailer
const email = async (req, res) => {
  const result = await User.find({ email: req.body.email }).exec();

  // using handlebars to send html based email
  const emailSource = fs.readFileSync(
    path.join("api/views", "/email.hbs"),
    "utf8"
  );
  const emailHandlebars = handlebars.compile(emailSource);

  const confirmEmailLink =
    "http://" + req.get("host") + "/confirmation/" + result[0].confirmationCode;
  const htmlEmail = emailHandlebars({
    fullName: result[0].fullName,
    verifyLink: confirmEmailLink,
  });

  // NodeMailer Configuration
  // Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_GMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  // Step 2
  mailOptions = {
    from: `Xchange ${process.env.GOOGLE_GMAIL}`,
    to: "aakash.1tha@gmail.com",
    subject: "Welcome to Xchange! 👋 Please confirm your email address",
    html: htmlEmail,
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("!! Error occurs " + err);
    }

    return console.log("Email sent!!!");
  });
};

//
// For Confirmation after email sent from Xchange
// used in app.use()
const confirm = async (req, res, email) => {
  const result = await User.find({ email: email }).exec();

  // After Email Sent
  const confirmSource = fs.readFileSync(
    path.join("api/views", "/confirm.hbs"),
    "utf8"
  );
  const confirmHandlebars = handlebars.compile(confirmSource);
  const htmlConfirm = confirmHandlebars({ email: email });

  if (result[0].confirmed) {
    res.send(htmlConfirm);
  } else {
    res.end("<h1>Bad Request</h1>");
  }
};

//
const finalConfirm = async (req, res) => {
  const result = await User.find({ confirmationCode: req.params.token });
  // console.log("!!!!!!!!!! " + result[0].email);

  try {
    if (result.length > 0) {
      await User.updateOne(
        { _id: result[0]._id },
        { $set: { confirmed: true } }
      ).exec();
    }
    await confirm(req, res, result[0].email);
  } catch (err) {
    console.log("Error from confirmation Email " + err);
  }
};

module.exports = { email, confirm, finalConfirm };
