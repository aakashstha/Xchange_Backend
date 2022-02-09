const express = require("express");
const router = express.Router();

url = "http://localhost:8000";

// Each app.use(middleware) is called everytime a request is sent to the server
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello and Welcome to the Xchange - Classified Application API!!",
    HTTP: "200 OK",
    type: "GET",
    request: {
      Mobiles: `${url}/mobiles`,
      Bikes: `${url}/bikes`,
      Cars: `${url}/cars`,
      Electronics: `${url}/electronics`,
      Jobs: `${url}/jobs`,
      MusicInstruments: `${url}/musicInstruments`,
      Properties: `${url}/properties`,
      Rooms: `${url}/rooms`,
      Services: `${url}/services`,
      Books: `${url}/books`,
    },
  });
});

module.exports = router;
