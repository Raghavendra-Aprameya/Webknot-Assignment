import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventManagementPage from "./Components/EventManagementPage";
import TaskTrackerPage from "./Components/TaskTrackerPage";
import "bootstrap/dist/css/bootstrap.min.css";
import AttendeeManagementPage from "./Components/AttendeeManagementPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/ForgotPassword";
import OtpVerification from "./Components/OtpVerification";
import ChangePassword from "./Components/ChangePassword";
import axios from "axios";
import LandingPage from "./Components/Landing";

export default function App() {
  axios.defaults.withCredentials = true;

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
