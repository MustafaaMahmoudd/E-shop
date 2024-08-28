const jwt = require("jsonwebtoken");

const generate = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "11d" });

module.exports = generate;
