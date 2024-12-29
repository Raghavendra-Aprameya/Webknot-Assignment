import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventManagement from "./Components/EventManagementPage";
import TaskTrackerPage from "./Components/TaskTrackerPage";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventManagement />} />
          <Route
            path="/tasks/:event_id/:event_name"
            element={<TaskTrackerPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
