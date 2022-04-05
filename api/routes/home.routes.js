const express = require("express");
const router = express.Router();

mainURL = "http://localhost:8000/";
productURL = "http://localhost:8000/products/categorical/";

// Each app.use(middleware) is called everytime a request is sent to the server
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello and Welcome to the Xchange - Classified Application API!!",
    HTTP: "200 OK",
    type: "GET",
    request: {
      AdminPanel: `${mainURL}admin`,
      "All Products": `${mainURL}products`,
      "Product Category": "↓↓",
      Cars: `${productURL}cars`,
      Bikes: `${productURL}bikes`,
      Mobiles: `${productURL}mobiles`,
      Electronics: `${productURL}electronics`,
      Jobs: `${productURL}jobs`,
      MusicInstruments: `${productURL}musicInstruments`,
      Properties: `${productURL}properties`,
      Rooms: `${productURL}rooms`,
      Services: `${productURL}services`,
      Books: `${productURL}books`,
    },
  });
});

module.exports = router;
