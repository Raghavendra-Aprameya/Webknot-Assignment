const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
});
const taskRoute = require("./routes/taskRouter");
app.use("/api/v1/task", taskRoute);

const eventRoute = require("./routes/eventRouter");
app.use("/api/v1/event", eventRoute);

const attendeeRoute = require("./routes/attendeeRouter");
app.use("/api/v1/attendee", attendeeRoute);
module.exports = app;
