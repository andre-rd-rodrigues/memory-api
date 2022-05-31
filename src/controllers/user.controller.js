const { validationResult } = require("express-validator");
const { success } = require("../helpers/responseApi");
const User = require("../models/User");

const user = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors.array());

  const { id } = req.params;

  if (!id) return res.status(400).json("User id not provided");

  try {
    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json("User not found");

    return res
      .status(200)
      .json(success("User found successfully", user, res.statusCode));
  } catch (error) {
    console.log(error);
    return res.status(500).json("User - Server error");
  }
};

module.exports = {
  user
};
