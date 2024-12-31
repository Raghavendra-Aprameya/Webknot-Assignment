// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
// import { Link } from "react-router-dom";
// import { Modal, Button } from "react-bootstrap";

// export default function EventManagement() {
//   const [events, setEvents] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [isOpen, setIsOpen] = useState(false);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [error, setError] = useState("");
//   const [addEvent, setAddEvent] = useState({
//     name: "",
//     description: "",
//     location: "",
//     date: "",
//   });
//   const [updateEvent, setUpdateEvent] = useState({
//     name: "",
//     description: "",
//     location: "",
//     date: "",
//   });

//   // Fetch events from API
//   useEffect(() => {
//     const getEvents = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/v1/event");
//         const fetchedEvents = response.data?.data || [];
//         setEvents(fetchedEvents);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         setEvents([]);
//       }
//     };
//     getEvents();
//   }, []);

//   // Get events for a specific day
//   const getEventsByDate = (date) => {
//     return events.filter(
//       (event) => new Date(event.date).toDateString() === date.toDateString()
//     );
//   };

//   // Generate days for the calendar
//   const generateCalendarDays = (month) => {
//     const start = startOfMonth(month);
//     const end = endOfMonth(month);
//     return eachDayOfInterval({ start, end });
//   };

//   // Handle day click
//   const handleDayClick = (date) => {
//     setSelectedDate(date);
//   };

//   // Get highlighted days based on event dates
//   const highlightedDays = events.map((event) =>
//     new Date(event.date).toDateString()
//   );
//   const deleteEvent = async (event_id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:8000/api/v1/event/${Number(event_id)}`
//       );
//       if (response.data.success) {
//         console.log("Data deleted successfully");
//         // Refetch events
//         const updatedEvents = await axios.get(
//           "http://localhost:8000/api/v1/event"
//         );
//         setEvents(updatedEvents.data.data); // Update state with the latest events
//       }
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };

//   // Add new event
//   const addNewEvent = async () => {
//     try {
//       if (
//         !addEvent.name ||
//         !addEvent.description ||
//         !addEvent.location ||
//         !addEvent.date
//       ) {
//         setError("All fields are required.");
//         return;
//       }

//       const response = await axios.post("http://localhost:8000/api/v1/event/", {
//         name: addEvent.name,
//         description: addEvent.description,
//         location: addEvent.location,
//         date: addEvent.date,
//       });

//       if (response.data.success) {
//         setEvents((prevEvents) => [...prevEvents, response.data.data]);
//         setIsOpen(false);
//         setAddEvent({
//           name: "",
//           description: "",
//           location: "",
//           date: "",
//         });
//         setError("");
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error adding event:", error);
//       setError("Failed to add event. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Event Calendar</h1>

//       {/* Calendar Controls */}
//       <div className="mb-4 flex justify-between items-center">
//         <button
//           className="px-3 py-1 bg-gray-300 rounded"
//           onClick={() =>
//             setCurrentMonth(
//               new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
//             )
//           }
//         >
//           Previous
//         </button>
//         <span className="text-lg font-semibold">
//           {format(currentMonth, "MMMM yyyy")}
//         </span>
//         <button
//           className="px-3 py-1 bg-gray-300 rounded"
//           onClick={() =>
//             setCurrentMonth(
//               new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
//             )
//           }
//         >
//           Next
//         </button>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-7 gap-2">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
//           <div key={index} className="text-center font-semibold">
//             {day}
//           </div>
//         ))}

//         {generateCalendarDays(currentMonth).map((date, index) => {
//           const isHighlighted = highlightedDays.includes(date.toDateString());
//           const isSelected =
//             selectedDate && selectedDate.toDateString() === date.toDateString();
//           return (
//             <div
//               key={index}
//               className={`text-center cursor-pointer p-2 rounded ${
//                 isHighlighted ? "bg-orange-400 text-white" : "hover:bg-gray-100"
//               } ${isSelected ? "bg-blue-500 text-white" : ""}`}
//               onClick={() => handleDayClick(date)}
//             >
//               {format(date, "d")}
//             </div>
//           );
//         })}
//       </div>

//       {/* Event Details for Selected Day */}
//       {selectedDate && (
//         <div className="mt-4">
//           <h2 className="text-lg font-semibold">
//             Events on {format(selectedDate, "MMMM d, yyyy")}:
//           </h2>
//           {getEventsByDate(selectedDate).length > 0 ? (
//             getEventsByDate(selectedDate).map((event, index) => (
//               <div key={index} className="border p-2 mt-2">
//                 <p>
//                   Name: <strong>{event.name}</strong>
//                 </p>
//                 <p>
//                   Description:<strong>{event.description}</strong>
//                 </p>
//                 <p>
//                   Location:<strong>{event.location}</strong>
//                 </p>
//                 <Link
//                   to={`/tasks/${event.event_id}/${event.name}`}
//                   className="p-3 bg-red-600 rounded-xl text-white mt-20"
//                 >
//                   View Task
//                 </Link>
//                 <button
//                   className="p-3 bg-blue-700 rounded-xl mt-10 text-white ml-4"
//                   onClick={() => {
//                     deleteEvent(event.event_id);
//                   }}
//                 >
//                   Delete Event
//                 </button>
//                 <button
//                   className="p-3 bg-red-600 rounded-xl text-white mt-20"
//                   onClick={() => {
//                     setIsUpdateOpen(true);
//                   }}
//                 >
//                   UpdateEvent
//                 </button>
//                 <Modal
//                   show={isUpdateOpen}
//                   onHide={() => {
//                     setIsUpdateOpen(false);
//                   }}
//                 >
//                   <Modal.Header closeButton>Update Event</Modal.Header>
//                   <Modal.Body>
//                     Enter name:
//                     <input
//                       type="text"
//                       value={updateEvent.name || ""}
//                       onChange={(e) => {
//                         setUpdateEvent({
//                           name: e.target.value,
//                           ...updateEvent,
//                         });
//                       }}
//                     />
//                     <br />
//                     Enter description:
//                     <input
//                       type="text"
//                       value={event.description || ""}
//                       onChange={(e) => {
//                         setUpdateEvent({
//                           description: e.target.value,
//                           ...updateEvent,
//                         });
//                       }}
//                     />
//                     <br />
//                     Enter Location:
//                     <input
//                       type="text"
//                       value={event.location || ""}
//                       onChange={(e) => {
//                         setUpdateEvent({
//                           location: e.target.value,
//                           ...updateEvent,
//                         });
//                       }}
//                     />
//                     <br />
//                     Enter Date
//                     <input
//                       type="date"
//                       value={event.date || ""}
//                       onChange={(e) => {
//                         setUpdateEvent({
//                           date: e.target.value,
//                           ...updateEvent,
//                         });
//                       }}
//                     />
//                   </Modal.Body>
//                   <Modal.Footer>
//                     <Button>Update Event</Button>
//                   </Modal.Footer>
//                 </Modal>
//               </div>
//             ))
//           ) : (
//             <p>No events for this day.</p>
//           )}
//         </div>
//       )}

//       {/* Add Event Button */}
//       <button
//         className="p-4 bg-blue-700 rounded-xl mt-10 text-white"
//         onClick={() => setIsOpen(true)}
//       >
//         Add Event
//       </button>

//       {/* Add Event Modal */}
//       <Modal show={isOpen} onHide={() => setIsOpen(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Event</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <p className="text-red-500">{error}</p>}
//           <div>
//             <label>Enter Event Name:</label>
//             <input
//               type="text"
//               value={addEvent.name || ""}
//               onChange={(e) =>
//                 setAddEvent({ ...addEvent, name: e.target.value })
//               }
//               className="w-full mb-2 p-2 border"
//             />
//           </div>
//           <div>
//             <label>Enter Description:</label>
//             <input
//               type="text"
//               value={addEvent.description || ""}
//               onChange={(e) =>
//                 setAddEvent({ ...addEvent, description: e.target.value })
//               }
//               className="w-full mb-2 p-2 border"
//             />
//           </div>
//           <div>
//             <label>Enter Location:</label>
//             <input
//               type="text"
//               value={addEvent.location || ""}
//               onChange={(e) =>
//                 setAddEvent({ ...addEvent, location: e.target.value })
//               }
//               className="w-full mb-2 p-2 border"
//             />
//           </div>
//           <div>
//             <label>Enter Date:</label>
//             <input
//               type="date"
//               value={addEvent.date || ""}
//               onChange={(e) =>
//                 setAddEvent({ ...addEvent, date: e.target.value })
//               }
//               className="w-full mb-2 p-2 border"
//             />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={addNewEvent}>Add Event</Button>
//         </Modal.Footer>
//       </Modal>

//       <div className="mb-4 flex justify-end">
//         <Link
//           to="/attendee"
//           className="px-4 py-2 bg-green-600 text-white rounded"
//         >
//           Check out Attendees
//         </Link>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
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

  // Fetch events from API
  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/event");
        const fetchedEvents = response.data?.data || [];
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
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

  const deleteEvent = async (event_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/event/${Number(event_id)}`
      );
      if (response.data.success) {
        console.log("Data deleted successfully");
        // Refetch events
        const updatedEvents = await axios.get(
          "http://localhost:8000/api/v1/event"
        );
        setEvents(updatedEvents.data.data); // Update state with the latest events
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Add new event
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

      const response = await axios.post("http://localhost:8000/api/v1/event/", {
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
      const response = await axios.patch(
        `http://localhost:8000/api/v1/event/${event_id}`,
        updateEvent
      );
      if (response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === updateEvent.event_id
              ? { ...event, ...updateEvent }
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
                  Name: <strong>{event.name}</strong>
                </p>
                <p>
                  Description:<strong>{event.description}</strong>
                </p>
                <p>
                  Location:<strong>{event.location}</strong>
                </p>
                <Link
                  to={`/tasks/${event.event_id}/${event.name}`}
                  className="p-3 bg-red-600 rounded-xl text-white mt-20"
                >
                  View Task
                </Link>
                <button
                  className="p-3 bg-blue-700 rounded-xl mt-10 text-white ml-4"
                  onClick={() => {
                    deleteEvent(event.event_id);
                  }}
                >
                  Delete Event
                </button>
                <button
                  className="p-3 bg-red-600 rounded-xl text-white mt-20"
                  onClick={() => {
                    setUpdateEvent(event);
                    setIsUpdateOpen(true);
                  }}
                >
                  Update Event
                </button>
                <Modal
                  show={isUpdateOpen}
                  onHide={() => {
                    setIsUpdateOpen(false);
                  }}
                >
                  <Modal.Header closeButton>Update Event</Modal.Header>
                  <Modal.Body>
                    <label>Enter name:</label>
                    <input
                      type="text"
                      value={updateEvent.name || ""}
                      onChange={(e) => {
                        handleUpdateEventChange("name", e.target.value);
                      }}
                    />
                    <br />
                    <label>Enter description:</label>
                    <input
                      type="text"
                      value={updateEvent.description || ""}
                      onChange={(e) => {
                        handleUpdateEventChange("description", e.target.value);
                      }}
                    />
                    <br />
                    <label>Enter Location:</label>
                    <input
                      type="text"
                      value={updateEvent.location || ""}
                      onChange={(e) => {
                        handleUpdateEventChange("location", e.target.value);
                      }}
                    />
                    <br />
                    <label>Enter Date:</label>
                    <input
                      type="date"
                      value={updateEvent.date || ""}
                      onChange={(e) => {
                        handleUpdateEventChange("date", e.target.value);
                      }}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => {
                        handleUpdateEvent(event.event_id);
                      }}
                    >
                      Update Event
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}

      {/* Add Event Button */}
      <button
        className="p-4 bg-blue-700 rounded-xl mt-10 text-white"
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
          </div>
          <div>
            <label>Enter Description:</label>
            <input
              type="text"
              value={addEvent.description}
              onChange={(e) =>
                setAddEvent({ ...addEvent, description: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
          </div>
          <div>
            <label>Enter Location:</label>
            <input
              type="text"
              value={addEvent.location}
              onChange={(e) =>
                setAddEvent({ ...addEvent, location: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />
          </div>
          <div>
            <label>Enter Date:</label>
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
          <Button onClick={addNewEvent}>Add Event</Button>
        </Modal.Footer>
      </Modal>

      <div className="mb-4 flex justify-end">
        <Link
          to="/attendee"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Check out Attendees
        </Link>
      </div>
    </div>
  );
}
