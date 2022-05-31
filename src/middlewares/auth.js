const { check } = require("express-validator");
const { error } = require("../helpers/responseApi");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty()
];

exports.loginValidation = [
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty()
];

/**
 * Get authenticated user data from JWT
 */
exports.auth = async (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  const { id } = req.params;
  // Get the type of token and actual token
  const bearer = authorizationHeader.split(" ")[0];
  const token = authorizationHeader.split(" ")[1];

  // Check the type
  if (bearer !== "Bearer")
    return res
      .status(400)
      .json(error("The type is must be a Bearer", res.statusCode));

  // Check the token
  if (!token) return res.status(404).json(error("No token found"));

  try {
    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json("User not found");

    const jwtData = await jwt.verify(token, user.secret_key);

    // Check the JWT token
    if (!jwtData)
      return res.status(401).json(error("Unauthorized", res.statusCode));

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json(error("Unauthorized", res.statusCode));
  }
};
