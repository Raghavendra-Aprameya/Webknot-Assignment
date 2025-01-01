import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Event Manager
        </h1>
        <p className="text-xl text-white mb-8">
          Manage your events and attendees seamlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/event"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            View Events
          </Link>
          <Link
            to="/attendee"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            View Attendees
          </Link>
        </div>
      </div>
    </div>
  );
}
