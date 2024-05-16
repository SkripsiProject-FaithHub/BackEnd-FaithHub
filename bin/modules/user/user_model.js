const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: [true, "user must have a name"],
  },

  displayName: {
    type: String,
    default: "",
  },

  religion: {
    type: String,
    required: [true, "user must have a religion"],
  },

  about: {
    type: String,
    default: "",
  },

  gender: {
    type: String,
    default: "male",
  },

  email: {
    type: String,
    required: [true, "user must provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },

  photo: {
    type: String,
    default: process.env.DEFAULT_PROFILE_PIC,
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },

  role: {
    type: String,
    enum: ["user", "banned", "admin"],
    default: "user",
  },

  posts: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },

  favourites: {
    type: Array,
    default: [],
  },

  articleCount: {
    type: Number,
    default: 0,
  },

  questionCount: {
    type: Number,
    default: 0,
  },

  repliesCount: {
    type: Number,
    default: 0,
  },

  reputation: {
    type: Number,
    default: 0,
  }

});
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => await bcrypt.compare(candidatePassword, userPassword);

const User = mongoose.model("User", userSchema);
module.exports = User;