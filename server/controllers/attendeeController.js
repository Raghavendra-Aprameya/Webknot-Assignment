const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { addSchema } = require("../utils/AttendeeSchema");
const z = require("zod");

const getAllAttendees = async (req, res) => {
  try {
    const data = await prisma.attendee.findMany({});

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to get attendees",
      error: err,
    });
  }
};
const addAttendee = async (req, res) => {
  try {
    const parsedData = addSchema.safeParse(req.body);
    if (parsedData.success) {
      const data = await prisma.attendee.create({
        data: {
          ...parsedData.data,
        },
      });
      res.status(200).json({ success: true, data: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to get attendees",
      error: err,
    });
  }
};
const deleteAttendee = async (req, res) => {
  try {
    const data = await prisma.attendee.delete({
      where: {
        attendee_id: Number(req.params.id),
      },
    });
    res
      .status(200)
      .json({ success: true, data: data, message: "deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendees",
      error: err,
    });
  }
};
module.exports = { getAllAttendees, addAttendee, deleteAttendee };
