const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// using handlebars to send html based email
const emailTemplateSource = fs.readFileSync(
  path.join("api/views", "/template.hbs"),
  "utf8"
);
const template = handlebars.compile(emailTemplateSource);
const htmlToSend = template({ message: "Aakash" });

module.exports = async () => {
  // Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_GMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  // Step 2
  let mailOptions = {
    from: process.env.GOOGLE_GMAIL,
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
