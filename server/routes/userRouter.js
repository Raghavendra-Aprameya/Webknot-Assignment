const express = require("express");

const {
  signin,
  signup,
  logout,
  otpVerification,
  forgotPassword,
  changePassword,
} = require("../controllers/authenticationController");
const router = express.Router();
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/otpVerification", otpVerification);
router.patch("/changePassword", changePassword);
module.exports = router;
