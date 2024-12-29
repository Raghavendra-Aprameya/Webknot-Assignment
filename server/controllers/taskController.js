const { PrismaClient } = require("@prisma/client");
const { addSchema, updateSchema } = require("../utils/TaskSchema");
const z = require("zod");

const prisma = new PrismaClient();

const getTask = async (req, res) => {
  try {
    const data = await prisma.task.findMany({
      where: {
        event_id: Number(req.params.id),
      },
    });
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to get task",
      error: err,
    });
  }
};

const addTask = async (req, res) => {
  try {
    console.log(req.body.event_id);
    const parsedData = addSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: parsedData.error.errors,
      });
    }

    const event = await prisma.event.findUnique({
      where: { event_id: req.body.event_id },
      select: { date: true },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const inputDate = new Date(req.body.deadline);
    const eventDate = new Date(event.date);

    if (inputDate < eventDate) {
      return res.status(400).json({
        success: false,
        message: "The deadline must be today or in the future",
      });
    }
    const attendee = await prisma.attendee.findUnique({
      where: {
        attendee_id: req.body.attendee_id,
      },
    });
    if (!attendee) {
      return res
        .status(404)
        .json({ success: false, message: "attendee not found" });
    }
    const data = await prisma.task.create({
      data: {
        name: parsedData.data.name,
        deadline: inputDate.toISOString(),
        attendee_id: req.body.attendee_id, // Explicitly map attendee_id
        event_id: req.body.event_id, // Explicitly map event_id
        status: "Pending", // Default status
      },
    });

    res.status(200).json({
      success: true,
      message: "Task added successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error in addTask:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const parsedData = updateSchema.safeParse(req.body);

    if (parsedData.success) {
      const taskid = await prisma.task.findUnique({
        where: {
          task_id: parsedData.data.task_id,
        },
      });
      if (!taskid) {
        res
          .status(404)
          .json({ success: false, message: "Couldn't find the task" });
      }
      const status = taskid.status === "Pending" ? "Completed" : "Pending";
      const data = await prisma.task.update({
        where: {
          task_id: parsedData.data.task_id,
        },
        data: {
          status: status,
        },
      });
      res.status(200).json({
        success: true,
        data: data,
        message: "status Updated Successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: parsedData.error.errors,
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update Task status" });
  }
};

module.exports = { getTask, addTask, updateTaskStatus };
