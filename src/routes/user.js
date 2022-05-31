const router = require("express").Router();

//Controllers
const { user } = require("../controllers/user.controller");

//Middlewares
const { auth } = require("../middlewares/auth");

router.get("/:id", auth, user);

module.exports = router;
