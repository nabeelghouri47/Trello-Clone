const jwt = require("jsonwebtoken");

exports.generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
