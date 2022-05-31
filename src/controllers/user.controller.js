const { validationResult } = require("express-validator");
const { success } = require("../helpers/responseApi");
const User = require("../models/User");

const add_game_match = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors.array());

  //Find user
  const { id } = req.params;
  const { moves, duration, date } = req.body;

  if (!id) return res.status(400).json("User id not provided");

  try {
    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json("User not found");

    //Add game to history
    user.games.history = [...user.games.history, { moves, duration, date }];
    user.save();

    return res
      .status(200)
      .json(
        success(
          "Game match added successfully",
          { moves, duration, date },
          res.statusCode
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json("add_game_match - Server error");
  }
};

module.exports = {
  add_game_match
};
