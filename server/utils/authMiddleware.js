import express from "express";
const app = express();

const loginCheck = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).json({ success: false, message: "Please Login First!!" });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Auth Error" });
  }
};
export { loginCheck };
