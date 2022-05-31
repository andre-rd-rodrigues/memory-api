const router = require("express").Router();

//Controllers
const { register, login } = require("../controllers/auth.controller");

//Middlewares
const { registerValidation, loginValidation } = require("../middlewares/auth");

//Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
