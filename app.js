// This is kind of middleware

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

const adminRoutes = require("./api/routes/admin");
const mobileRoutes = require("./api/routes/mobile");



// For Database Connection
const URI =
  "mongodb+srv://xchange:" +
  process.env.MONGO_DB_PW +
  "@xchange.nrbdi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(URI, async (err) => {
  if (err) throw err;
  console.log("conncted to db");
});

app.use(express.json());
app.use(morgan("tiny"));


app.use("/admin", adminRoutes);
app.use("/mobile", mobileRoutes);


// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works!",
//   });
// });

module.exports = app;
