const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");
var rand, mailOptions, emailFind;

// Send email to verify from nodemailer
const email = async (req, res) => {
  emailFind = req.body.email;
  const result = await User.find({ email: req.body.email }).exec();

  // using handlebars to send html based email
  const emailTemplateSource = fs.readFileSync(
    path.join("api/views", "/email.hbs"),
    "utf8"
  );
  const template = handlebars.compile(emailTemplateSource);

  // NodeMailer Configuration
  // Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_GMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  rand = Math.floor(Math.random() * 100 + 54);
  const confirmationLink =
    "http://" + req.get("host") + "/confirmation/" + result[0].confirmationCode;
  const htmlToSend = template({
    message: result[0].fullName,
    link: confirmationLink,
  });
  // Step 2
  mailOptions = {
    from: `Xchange ${process.env.GOOGLE_GMAIL}`,
    to: "aakash.1tha@gmail.com",
    subject: "Welcome to Xchange! 👋 Please confirm your email address",
    html: htmlToSend,
  };

  // Step 3
  await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs " + err);
    }

    return console.log("Email sent!!!");
  });
};

// For Confirmation after email sent from Xchange
// used in app.use()
const confirm = async (req, res) => {
  const result = await User.find({ email: emailFind }).exec();

  // After Email Sent
  const pathConfirmationLink = fs.readFileSync(
    path.join("api/views", "/confirm.hbs"),
    "utf8"
  );
  const templateConfirmationLink = handlebars.compile(pathConfirmationLink);
  const htmlConfirm = templateConfirmationLink({ email: result[0].email });

  if (result[0].confirmed) {
    res.send(htmlConfirm);
    // res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
  } else {
    res.end("<h1>Bad Request</h1>");
  }
};

const finalSend = async (req, res) => {
  const result = await User.find({ confirmationCode: req.params.token });
  //console.log("!!!!!!!!!! " + result[0]);

  try {
    if (result.length > 0) {
      await User.updateOne(
        { _id: result[0]._id },
        { $set: { confirmed: true } }
      ).exec();
    }
    await confirm(req, res);
  } catch (err) {
    console.log("Error from confirmation Email " + err);
  }
};

module.exports = { email, confirm, finalSend };
