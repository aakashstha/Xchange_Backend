// This is kind of middleware for the whole project

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const csvtojson = require("csvtojson");
const mongodb = require("mongodb");

const homeRoutes = require("./api/routes/home.routes");
const adminRoutes = require("./api/routes/admin.routes");
const userRoutes = require("./api/routes/user.routes");
const productRoutes = require("./api/routes/products.routes");
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

// For handling CORS (Cross-Origin Resource Sharing)
// It must be done before reaching our routes which is down below
app.use(cors());

// My Xchange_Backend main routes
app.use("/", homeRoutes);
//app.use("/admin1", adminRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
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

// //
// //
// const csvtojson = require("csvtojson");
// const mongodb = require("mongodb");
// const mongoose = require("mongoose");

// var url =
//   "mongodb+srv://xchange:xchange@xchange.nrbdi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// var dbConn;
// mongodb.MongoClient.connect(url, {
//   useUnifiedTopology: true,
// })
//   .then((client) => {
//     console.log("DB Connected!");

//     const fileName = "services.csv";
//     var arrayToInsert = [];
//     csvtojson()
//       .fromFile(fileName)
//       .then((source) => {
//         // Fetching the all data from each row
//         // source.length
//         for (var i = 0; i < source.length; i++) {
//           var date = new Date(source[i]["date"]);

//           var oneRow = {
//             // book, musicInstruments, services
//             adTitle: source[i]["adTitle"],
//             price: parseInt(source[i]["price"]),
//             description: source[i]["description"],
//             location: source[i]["location"],
//             category: source[i]["category"],
//             userId: source[i]["userId"],
//             date: date.toISOString(),
//             images: [],
//             _id: mongoose.Types.ObjectId(source[i]["_id"]),
//             // // mobile,
//             // brand: source[i]["brand"],
//           };
//           arrayToInsert.push(oneRow);
//         } //inserting into the table "employees"
//         // console.log(arrayToInsert);
//         // var collectionName = "myFirstDatabase.products";
//         dbConn = client.db();
//         var collection = dbConn.collection("products");
//         // console.log(dbConn.collection("products"));

//         collection.insertMany(arrayToInsert, (err, result) => {
//           if (err) console.log(err);
//           if (result) {
//             console.log("Imported all CSV into database successfully.");
//           }
//         });
//       });
//   })
//   .catch((err) => {
//     console.log("DB Connection Error: ${err.message}");
//   });
