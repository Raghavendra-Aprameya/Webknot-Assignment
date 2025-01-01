import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [addEvent, setAddEvent] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
  });
  const [updateEvent, setUpdateEvent] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/v1/event`);
        const fetchedEvents = response.data?.data || [];
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const getEventsByDate = (date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const generateCalendarDays = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const highlightedDays = events.map((event) =>
    new Date(event.date).toDateString()
  );

  const deleteEvent = async (event_id) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/api/v1/event/${Number(event_id)}`
      );
      if (response.data.success) {
        console.log("Data deleted successfully");
        const updatedEvents = await axios.get(`${serverUrl}/api/v1/event`);
        setEvents(updatedEvents.data.data);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const addNewEvent = async () => {
    try {
      if (
        !addEvent.name ||
        !addEvent.description ||
        !addEvent.location ||
        !addEvent.date
      ) {
        setError("All fields are required.");
        return;
      }

      const response = await axios.post(`${serverUrl}0/api/v1/event/`, {
        name: addEvent.name,
        description: addEvent.description,
        location: addEvent.location,
        date: addEvent.date,
      });

      if (response.data.success) {
        setEvents((prevEvents) => [...prevEvents, response.data.data]);
        setIsOpen(false);
        setAddEvent({
          name: "",
          description: "",
          location: "",
          date: "",
        });
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    }
  };

  const handleUpdateEventChange = (field, value) => {
    setUpdateEvent((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdateEvent = async (event_id) => {
    try {
      const updatedEventData = { ...updateEvent, event_id };

      const response = await axios.patch(
        `${serverUrl}/api/v1/event/${event_id}`,
        updatedEventData
      );

      if (response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === event_id
              ? { ...event, ...updatedEventData }
              : event
          )
        );
        setIsUpdateOpen(false);
        setUpdateEvent({
          name: "",
          description: "",
          location: "",
          date: "",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/v1/users/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/");
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative p-4">
      {/* Logout Button at top-right */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>

      <h1 className="text-xl font-bold mb-4">Event Calendar</h1>

      {/* Loader */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin border-t-4 border-blue-600 w-12 h-12 rounded-full mx-auto"></div>
          <p>Loading events...</p>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center flex-wrap">
        <button
          className="px-3 py-1 bg-gray-300 rounded mb-2 sm:mb-0"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          className="px-3 py-1 bg-gray-300 rounded mb-2 sm:mb-0"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {generateCalendarDays(currentMonth).map((date, index) => {
          const isHighlighted = highlightedDays.includes(date.toDateString());
          const isSelected =
            selectedDate && selectedDate.toDateString() === date.toDateString();
          return (
            <div
              key={index}
              className={`text-center cursor-pointer p-2 rounded ${
                isHighlighted ? "bg-orange-400 text-white" : "hover:bg-gray-100"
              } ${isSelected ? "bg-blue-500 text-white" : ""}`}
              onClick={() => handleDayClick(date)}
            >
              {format(date, "d")}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Events on {format(selectedDate, "MMMM d, yyyy")}:
          </h2>
          {getEventsByDate(selectedDate).length > 0 ? (
            getEventsByDate(selectedDate).map((event, index) => (
              <div key={index} className="border p-2 mt-2">
                <p>
                  Name: <strong>{event.name}</strong>
                </p>
                <p>
                  Description: <strong>{event.description}</strong>
                </p>
                <p>
                  Location: <strong>{event.location}</strong>
                </p>
                <Link
                  to={`/tasks/${event.event_id}/${event.name}`}
                  className="p-3 bg-red-600 rounded-xl text-white mt-2"
                >
                  View Task
                </Link>
                <button
                  className="p-3 bg-blue-700 rounded-xl mt-2 text-white ml-4"
                  onClick={() => deleteEvent(event.event_id)}
                >
                  Delete Event
                </button>
                <button
                  className="p-3 bg-red-600 rounded-xl text-white mt-2"
                  onClick={() => {
                    setUpdateEvent(event);
                    setIsUpdateOpen(true);
                  }}
                >
                  Update Event
                </button>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}

      <button
        className="p-4 bg-blue-700 rounded-xl mt-4 text-white"
        onClick={() => setIsOpen(true)}
      >
        Add Event
      </button>

      {/* Add Event Modal */}
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label>Enter Event Name:</label>
            <input
              type="text"
              value={addEvent.name}
              onChange={(e) =>
                setAddEvent({ ...addEvent, name: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
            <label>Enter Description:</label>
            <textarea
              value={addEvent.description}
              onChange={(e) =>
                setAddEvent({ ...addEvent, description: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
            <label>Enter Location:</label>
            <input
              type="text"
              value={addEvent.location}
              onChange={(e) =>
                setAddEvent({ ...addEvent, location: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
            <label>Event Date:</label>
            <input
              type="date"
              value={addEvent.date}
              onChange={(e) =>
                setAddEvent({ ...addEvent, date: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addNewEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Event Modal */}
      <Modal show={isUpdateOpen} onHide={() => setIsUpdateOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Enter Event Name:</label>
            <input
              type="text"
              value={updateEvent.name}
              onChange={(e) => handleUpdateEventChange("name", e.target.value)}
              className="w-full mb-2 p-2 border"
            />
            <label>Enter Description:</label>
            <textarea
              value={updateEvent.description}
              onChange={(e) =>
                handleUpdateEventChange("description", e.target.value)
              }
              className="w-full mb-2 p-2 border"
            />
            <label>Enter Location:</label>
            <input
              type="text"
              value={updateEvent.location}
              onChange={(e) =>
                handleUpdateEventChange("location", e.target.value)
              }
              className="w-full mb-2 p-2 border"
            />
            <label>Event Date:</label>
            <input
              type="date"
              value={updateEvent.date}
              onChange={(e) => handleUpdateEventChange("date", e.target.value)}
              className="w-full mb-2 p-2 border"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsUpdateOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateEvent(updateEvent.event_id)}
          >
            Update Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
