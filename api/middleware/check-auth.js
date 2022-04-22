const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.body.authorization);
  // console.log(req.headers.authorization);

  try {
    const token = req.headers.authorization || req.body.authorization;

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.adminData = decoded;
    // Here we have to call next() if we successfully authenticate
    // and we donot call it if we did not successed
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed check-auth Middleware",
    });
  }
};
