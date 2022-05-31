const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 150
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150
  },
  games: {
    history: []
  },
  secret_key: {
    type: String,
    maxlength: 255
  },
  token: {
    type: String,
    maxlength: 255
  }
});

module.exports = mongoose.model("User", userSchema);
