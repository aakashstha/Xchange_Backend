const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => { 
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, "secretJWT");
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
