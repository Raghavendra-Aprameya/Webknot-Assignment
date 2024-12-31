import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    Firstname: "",
    LastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/signup",
        formData
      );
      if (response.data.success) {
        setMessage("Signup successful! You can now log in.");
        setError([]);
        setFormData({
          Firstname: "",
          LastName: "",
          email: "",
          password: "",
          phone: "",
        });
        navigate("/");
      } else {
        setMessage("");
        setError(response.data.message);
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
      setError([]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Signup
        </h2>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
        {error.length > 0 && (
          <div className="mt-4 text-red-500">
            {error.map((err, index) => (
              <p key={index}>
                {err.path.join(" > ")}: {err.message}
              </p>
            ))}
          </div>
        )}
        <form onSubmit={handleSignup} className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="Firstname"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                First Name
              </label>
              <input
                type="text"
                id="Firstname"
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="First Name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="LastName"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Last Name
              </label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
