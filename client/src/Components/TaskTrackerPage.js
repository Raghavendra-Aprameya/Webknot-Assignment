import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TaskTrackerPage() {
  const { event_id, event_name } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/task/${event_id}`
        );
        if (response.data.success) {
          setTasks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [event_id]);

  // Update the status for a specific task
  const updateStatus = async (task_id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/task/`, // Ensure you're sending the correct URL
        { task_id: task_id }
      );
      if (response.data.success) {
        // Update status for the specific task
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === task_id
              ? { ...task, status: response.data.status }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">
        Tasks for Event: {event_name}
      </h1>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="border-2 border-gray-300 shadow-lg p-4 rounded-xl"
            >
              <p className="font-medium">Name: {task.name}</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              <p>Attendee: {task.attendee_id}</p>
              <p>Status: {task.status}</p>
              <button
                onClick={() => updateStatus(task.task_id)} // Ensure the function is called on click
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Update Status
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}
