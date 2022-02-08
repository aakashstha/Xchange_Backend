const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

var rand, mailOptions;
// Send email to verify from nodemailer
const sendEmail = async (req, res) => {
  // using handlebars to send html based email
  const emailTemplateSource = fs.readFileSync(
    path.join("api/views", "/sendEmailToConfirm.hbs"),
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
  const confirmationLink = "http://" + req.get("host") + "/verify?id=" + rand;
  const htmlToSend = template({ message: "Aakash", link: confirmationLink });
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
const confirmationLink = (req, res) => {
  // After Email Sent
  const pathConfirmationLink = fs.readFileSync(
    path.join("api/views", "/confirmationLink.hbs"),
    "utf8"
  );
  const templateConfirmationLink = handlebars.compile(pathConfirmationLink);
  const htmlConfirmationLink = templateConfirmationLink();

  if (req.query.id == rand) {
    res.send(htmlConfirmationLink);
    // res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
  } else {
    res.end("<h1>Bad Request</h1>");
  }
};

module.exports = { sendEmail, confirmationLink };
