const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

