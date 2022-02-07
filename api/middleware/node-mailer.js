const nodemailer = require("nodemailer");

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
    subject: "Nodemailer - Test from Aakash",
    text: "Wooohooo it works!! from Aakash Shrestha",
  };

  // Step 3
  await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs " + err);
    }

    return console.log("Email sent!!!");
  });
};
