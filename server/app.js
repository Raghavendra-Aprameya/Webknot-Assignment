const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// app.use(cors());

app.use(
  cors({
    origin: ["http://localhost:3000", `${process.env.CLIENT_URL}`],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hdsh");
});

// const taskRoute = require("./routes/taskRouter");
// app.use("/api/v1/task", taskRoute);

// const eventRoute = require("./routes/eventRouter");
// app.use("/api/v1/event", eventRoute);

// const attendeeRoute = require("./routes/attendeeRouter");
// app.use("/api/v1/attendee", attendeeRoute);

// const userRoutes = require("./routes/userRouter");

// app.use("/api/v1/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
});

module.exports = app;
