const z = require("zod");
const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const app = express();

// Start the Express server and get the HTTP server instance
const server = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// Initialize WebSocket server using the HTTP server instance
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("A client connected");

  // Handle messages from the client (if needed)
  ws.on("message", (message) => {
    console.log("Received message from client:", message);
  });

  ws.on("close", () => {
    console.log("A client disconnected");
  });
});
const broadcastProgress = async (event_id) => {
  try {
    const pending = await prisma.task.count({
      where: { event_id, status: "Pending" },
    });
    const completed = await prisma.task.count({
      where: { event_id, status: "Completed" },
    });

    const total = pending + completed;
    const progress = total === 0 ? 0 : (completed / total) * 100;

    const message = JSON.stringify({ progress });

    // Send the progress data to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } catch (error) {
    console.error("Error calculating progress:", error);
  }
};
module.exports = { wss };
