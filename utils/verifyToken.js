const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const authHeader = req.headers.authtoken
    console.log("b");
    console.log(authHeader);
  if (authHeader) {
    console.log(authHeader);
    const token = authHeader;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is Invalid or Session Expired..!" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Authentication Failed..!" });
  }
}

module.exports = authenticate;
