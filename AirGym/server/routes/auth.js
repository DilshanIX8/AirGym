const express = require("express");
const login = require("./auth/login");
const register = require("./auth/register");
const verifyEmail = require("./auth/verify-email");
const forgotPassword = require("./auth/forgot-password");
const resetPassword = require("./auth/rest-password");
const router = express.Router();

router.post("/login", async (req, res) => {
  return await login(req, res);
});

router.post("/register", async (req, res) => {
  return await register(req, res);
});

router.post("/verify-email", async (req, res) => {
  return await verifyEmail(req, res);
});

router.post("/forgot-password", async (req, res) => {
  return await forgotPassword(req, res);
});

router.post("/reset-password", async (req, res) => {
  return await resetPassword(req, res);
});

module.exports = router;
