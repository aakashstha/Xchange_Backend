// This is kind of middleware

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const homeRoutes = require("./api/routes/home.routes");
const adminRoutes = require("./api/routes/admin.routes");
const mobileRoutes = require("./api/routes/mobile.routes");

// For Database Connection
("mongodb+srv://xchange:xchange@xchange.nrbdi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
const URI =
  "mongodb+srv://xchange:" +
  process.env.MONGO_DB_PW +
  "@xchange.nrbdi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(URI, (err) => {
  if (err) throw err;
  console.log("conncted to db");
});

// express.json() is a built express middleware that convert request body to JSON.
app.use(express.json());
// For logging incoming request in the Console.
app.use(morgan("tiny"));
// It makes uploads folder publically available
app.use("/uploads", express.static("uploads"));
// For handling CORS (Cross-Origin Resource Sharing)
// It must be done before reaching our routes which is down below
app.use(cors());

// My Xchange_Backend main routes
app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/mobiles", mobileRoutes);

// testing
var nodemailer = require("nodemailer");

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_GMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

// app.get("/", function (req, res) {
//   res.sendfile("index.html");
// });
app.get("/send", function (req, res) {
  rand = Math.floor(Math.random() * 100 + 54);
  link = "http://" + req.get("host") + "/verify?id=" + rand;
  mailOptions = {
    from: `Xchange ${process.env.GOOGLE_GMAIL}`,
    subject: "Nice Nodemailer test",
    to: "aakash.1tha@gmail.com",
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>",
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});

app.get("/verify", function (req, res) {
  console.log("Host!!!!!!" + host);
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + req.get("host")) {
    console.log("Domain is matched. Information is from Authentic email");
    if (req.query.id == rand) {
      console.log("email is verified");
      res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
    } else {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
});

// Custom Error Handle Response
// Here we are using app.use() because we do not know which HTTP method user might use.
app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: "Not Found from app",
  });
});

module.exports = app;
