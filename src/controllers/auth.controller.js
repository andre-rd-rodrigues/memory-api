const User = require("../models/User");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error, validation } = require("../helpers/responseApi");
const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");

/**
 * @desc    Register a new user
 * @method  POST api/auth/register
 */

const register = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { name, email, password, token } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(409).json("User already registered");

    let newUser = new User({
      name,
      email: email.toLowerCase().replace(/\s+/, ""),
      password,
      games: { history: [] },
      secret_key: randomBytes(64).toString("hex")
    });

    // Hash the password
    const hash = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, hash);

    // Save the user
    await newUser.save();

    res.status(201).json(
      success(
        "Register success",
        {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            games: newUser.games,
            token: randomBytes(64).toString("hex")
          }
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    return res.json(500, error("Login server error", res.statusCode));
  }
};

const login = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors.array());

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //Check email
    if (!user) return res.status(422).json("Invalid credentials");

    //Check password
    let checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) return res.status(422).json("Invalid credentials");

    // Send response with JWT
    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };

    jwt.sign(payload, user.secret_key, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      //Return JWT token
      res.status(200).json(success("Login success", { token }, res.statusCode));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Login - Server error");
  }
};

const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens = async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
};

const forgotPassword = async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
};

const sendVerificationEmail = async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  register,
  login
};
