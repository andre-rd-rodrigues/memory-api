const router = require("express").Router();

//Controllers
const { add_game_match } = require("../controllers/user.controller");

//Middlewares
const { auth } = require("../middlewares/auth");

router.post("/:id/games/history", auth, add_game_match);

module.exports = router;
