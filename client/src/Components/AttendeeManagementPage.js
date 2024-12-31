import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function AttendeeManagementPage() {
  const [attendees, setAttendees] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const getAttendees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/attendee"
        );
        if (response.data.success) {
          setAttendees(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };
    getAttendees();
  }, []);

  const addAttendee = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/attendee",
        {
          name,
        }
      );
      if (response.data.success) {
        setAttendees((prevAttendees) => [...prevAttendees, response.data.data]);
        setIsOpen(false);
        setName("");
      }
    } catch (error) {
      console.error("Error adding attendee:", error);
    }
  };

  const deleteAttendee = async (attendee_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/attendee/${attendee_id}`
      );
      if (response.data.success) {
        const response = await axios.get(
          "http://localhost:8000/api/v1/attendee"
        );
        if (response.data.success) {
          setAttendees(response.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Attendee Management
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 border border-gray-300 text-left font-semibold text-sm">
                ID
              </th>
              <th className="p-4 border border-gray-300 text-left font-semibold text-sm">
                Name
              </th>
              <th className="p-4 border border-gray-300 text-left font-semibold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr
                key={attendee.attendee_id}
                className="even:bg-gray-50 hover:bg-gray-100"
              >
                <td className="p-4 border border-gray-300 text-sm">
                  {attendee.attendee_id}
                </td>
                <td className="p-4 border border-gray-300 text-sm">
                  {attendee.name}
                </td>
                <td className="p-4 border border-gray-300 text-sm">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:ring focus:ring-red-300"
                    onClick={() => deleteAttendee(attendee.attendee_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
          onClick={() => setIsOpen(true)}
        >
          Add Attendee
        </button>
      </div>

      {/* Add Attendee Modal */}
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Attendee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
              placeholder="Enter attendee name"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addAttendee}>
            Add Attendee
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
