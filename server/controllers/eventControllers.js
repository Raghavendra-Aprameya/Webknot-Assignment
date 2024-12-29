const { PrismaClient } = require("@prisma/client");
const { eventSchema, updateSchema } = require("../utils/EventSchemas");
const z = require("zod");

const prisma = new PrismaClient();

const getAllEvents = async (req, res) => {
  try {
    const data = await prisma.event.findMany({});
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, error: "Failed to fetch events." });
  }
};

const addEvent = async (req, res) => {
  try {
    const parsedData = eventSchema.safeParse(req.body);

    if (parsedData.success) {
      const formattedDate = new Date(parsedData.data.date).toISOString();

      const data = await prisma.event.create({
        data: {
          ...parsedData.data,
          date: formattedDate,
        },
      });

      res.status(200).json({ success: true, data: data });
    } else {
      res.status(400).json({
        success: false,
        message: parsedData.error.errors.map((e) => ({
          message: e.message,
          path: e.path,
        })),
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, data: err });
  }
};

const updateEvent = async (req, res) => {
  try {
    const parsedData = updateSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: parsedData.error.errors.map((e) => ({
          message: e.message,
          path: e.path,
        })),
      });
    }
    const formattedDate = new Date(parsedData.data.date).toISOString();
    const updatedEvent = await prisma.event.update({
      where: {
        event_id: Number(req.params.id),
      },
      data: {
        ...parsedData.data,
        date: formattedDate,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: err,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const data = await prisma.event.delete({
      where: {
        event_id: Number(req.params.id),
      },
    });
    res.status(200).json({
      success: true,
      message: "Event Deleted Successfully",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: err,
    });
  }
};
module.exports = { getAllEvents, addEvent, updateEvent, deleteEvent };
