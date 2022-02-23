// This is kind of middleware for the whole project

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const homeRoutes = require("./api/routes/home.routes");
const adminRoutes = require("./api/routes/admin.routes");
const userRoutes = require("./api/routes/user.routes");
const mobileRoutes = require("./api/routes/products/mobile.routes");
const carRoutes = require("./api/routes/products/car.routes");
const bikeRoutes = require("./api/routes/products/bike.routes");
const jobRoutes = require("./api/routes/products/job.routes");
const propertyRoutes = require("./api/routes/products/property.routes");
const roomRoutes = require("./api/routes/products/room.routes");
const serviceRoutes = require("./api/routes/products/service.routes");
const bookRoutes = require("./api/routes/products/book.routes");
const electronicRoutes = require("./api/routes/products/electronic.routes");
const musicInstrumentRoutes = require("./api/routes/products/musicInstrument.routes");
const adminBroRoutes = require("./api/routes/adminPanel.routes");

const nodemailer = require("./api/middleware/node-mailer");

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
//// app.use("/uploads", express.static("uploads"));
// For handling CORS (Cross-Origin Resource Sharing)
// It must be done before reaching our routes which is down below
app.use(cors());

// My Xchange_Backend main routes
app.use("/", homeRoutes);
//app.use("/admin1", adminRoutes);
app.use("/user", userRoutes);
app.use("/mobiles", mobileRoutes);
app.use("/cars", carRoutes);
app.use("/services", serviceRoutes);
app.use("/books", bookRoutes);
app.use("/electronics", electronicRoutes);
app.use("/musicInstruments", musicInstrumentRoutes);
app.use("/bikes", bikeRoutes);
app.use("/jobs", jobRoutes);
app.use("/rooms", roomRoutes);
app.use("/properties", propertyRoutes);
// Admin Panel route
app.use("/admin", adminBroRoutes);

// For Confirmation after email sent from Xchange
app.get("/confirmation/:token", nodemailer.finalConfirm);

// Custom Error Handle Response
// Here we are using app.use() because we do not know which HTTP method user might use.
app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: "Not Found from app",
  });
});

module.exports = app;
