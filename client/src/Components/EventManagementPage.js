import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"; // We'll use date-fns to handle date manipulation
import { Link } from "react-router-dom";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch events from API
  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/event");
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    getEvents();
  }, []);

  // Get events for a specific day
  const getEventsByDate = (date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  // Generate days for the calendar
  const generateCalendarDays = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  };

  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // Get highlighted days based on event dates
  const highlightedDays = events.map((event) =>
    new Date(event.date).toDateString()
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Event Calendar</h1>

      {/* Calendar Controls */}
      <div className="mb-4 flex justify-between items-center">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
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
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
        >
          Next
        </button>
      </div>

      {/* Calendar Grid */}
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

      {/* Event Details for Selected Day */}
      {selectedDate && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Events on {format(selectedDate, "MMMM d, yyyy")}:
          </h2>
          {getEventsByDate(selectedDate).length > 0 ? (
            getEventsByDate(selectedDate).map((event, index) => (
              <div key={index} className="border p-2 mt-2">
                <p>
                  <strong>{event.name}</strong>
                </p>
                <p>{event.description}</p>
                <p>{event.location}</p>
                {/* <p>{new Date(event.date).toLocaleTimeString()}</p> */}
                <Link
                  to={`/tasks/${event.event_id}/${event.name}`}
                  className=" p-3 bg-red-600 rounded-xl text-white mt-20"
                >
                  View Task
                </Link>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
