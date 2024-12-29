const express = require("express");
const {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventControllers");
const router = express.Router();

router.get("/", getAllEvents);
router.post("/", addEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);
module.exports = router;
