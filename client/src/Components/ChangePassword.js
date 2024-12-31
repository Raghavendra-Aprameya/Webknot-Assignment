import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic validation for matching passwords
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/users/changePassword",
        {
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("Password changed successfully.");
        setIsSuccess(true);
        navigate("/");
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Change Password
        </h2>
        {message && (
          <p
            className={`mt-4 text-center ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleChangePassword} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
