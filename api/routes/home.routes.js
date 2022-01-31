const express = require("express");
const router = express.Router();

url = "http://localhost:8000";

// Each app.use(middleware) is called everytime a request is sent to the server
router.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hello and Welcome to the Xchange - Classified Application and Recommendaion System!!",
    HTTP: "200 OK",
    type: "GET",
    request: {
      Mobiles: `${url}/mobiles`,
    },
  });
});

module.exports = router;
