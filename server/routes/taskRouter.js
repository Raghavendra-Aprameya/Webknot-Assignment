const express = require("express");

const {
  getTask,
  addTask,
  updateTaskStatus,
} = require("../controllers/taskController.js");
const router = express.Router();

router.get("/:id", getTask);
router.post("/", addTask);
router.patch("/", updateTaskStatus);

module.exports = router;
