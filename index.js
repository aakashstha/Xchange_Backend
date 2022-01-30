const http = require("http");
const app = require("./app");

// npm start    # to run the application
// npm test     # to run the test scripts
const port = process.env.PORT || 8000;

const server = http.createServer(app);

exports.hello = server.listen(port);
