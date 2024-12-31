import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventManagementPage from "./Components/EventManagementPage";
import TaskTrackerPage from "./Components/TaskTrackerPage";
import "bootstrap/dist/css/bootstrap.min.css";
import AttendeeManagementPage from "./Components/AttendeeManagementPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/tasks/:event_id/:event_name"
            element={<TaskTrackerPage />}
          />
          <Route path="/attendee" element={<AttendeeManagementPage />} />
          <Route path="/event" element={<EventManagementPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
