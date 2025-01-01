import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function TaskTrackerPage() {
  const { event_id, event_name } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addTaskDetails, setAddTaskDetails] = useState({
    name: "",
    deadline: "",
    attendee_id: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(
          `http://localhost:8000/api/v1/task/${event_id}`
        );
        if (response.data.success) {
          setTasks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [event_id]);

  const updateStatus = async (task_id) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/v1/task/`, {
        task_id: task_id,
      });
      if (response.data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === task_id
              ? {
                  ...task,
                  status: task.status === "Pending" ? "Completed" : "Pending",
                }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/task/", {
        ...newTask,
        event_id: Number(event_id),
        attendee_id: Number(newTask.attendee_id),
      });
      if (response.data.success) {
        setTasks((prevTasks) => [...prevTasks, response.data.data]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">
        Tasks for Event: {event_name}
      </h1>
      <button
        className="p-4 bg-blue-700 text-white rounded-lg"
        onClick={() => setIsModalOpen(true)}
      >
        Add Task
      </button>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="border-2 border-gray-300 shadow-lg p-4 rounded-xl"
            >
              <p className="font-medium">Name: {task.name}</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              <p>Attendee: {task.attendee_id}</p>
              <p>Status: {task.status}</p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded h-4">
                  <div
                    className={`h-4 rounded ${
                      task.status === "Completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: task.status === "Completed" ? "100%" : "50%",
                    }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => updateStatus(task.task_id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Update Status
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No tasks available.</p>
      )}

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="block mb-2">Task Name:</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={addTaskDetails.name}
              onChange={(e) =>
                setAddTaskDetails({ ...addTaskDetails, name: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2">Deadline:</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={addTaskDetails.deadline}
              onChange={(e) =>
                setAddTaskDetails({
                  ...addTaskDetails,
                  deadline: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2">Attendee ID:</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={addTaskDetails.attendee_id}
              onChange={(e) =>
                setAddTaskDetails({
                  ...addTaskDetails,
                  attendee_id: e.target.value.replace(/\D/g, ""), // Remove non-numeric characters
                })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => addTask(addTaskDetails)}
            disabled={
              !addTaskDetails.name ||
              !addTaskDetails.deadline ||
              !addTaskDetails.attendee_id
            }
          >
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mb-4 flex justify-end">
        <Link
          to="/attendee"
          className="px-4 py-2 bg-green-600 text-white rounded mt-10"
        >
          Check out Attendees
        </Link>
      </div>
    </div>
  );
}
