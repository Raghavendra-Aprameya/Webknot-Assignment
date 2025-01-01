const express = require("express");
const {
  getAllAttendees,
  addAttendee,
  deleteAttendee,
} = require("../controllers/AttendeeController.js");

const router = express.Router();

router.get("/", getAllAttendees);
router.post("/", addAttendee);
router.delete("/:id", deleteAttendee);

module.exports = router;
