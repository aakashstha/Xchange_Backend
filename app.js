// This is kind of middleware

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

const adminRoutes = require("./api/routes/admin");
const mobileRoutes = require("./api/routes/mobile.routes");

// For Database Connection
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

// My Xchange_Backend main routes
app.use("/admin", adminRoutes);
app.use("/mobiles", mobileRoutes);

// Home route of this app
app.get("/", (req, res, next) => {
  //res.send(200);
  res.send("Welcome fabulous people this is our main route!");
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
