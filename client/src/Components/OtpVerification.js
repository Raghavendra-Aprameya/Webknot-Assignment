import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const serverUrl = process.env.REACT_APP_SERVER_URL;

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      console.log(otp);
      const response = await axios.post(
        `${serverUrl}/api/v1/users/otpVerification`,
        {
          otp: Number(otp),
        }
      );

      if (response.data.success) {
        setMessage("OTP is correct. Verification successful!");
        setIsSuccess(true);
        navigate("/change-password");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          OTP Verification
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
        <form onSubmit={handleOtpVerification} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter the OTP sent to your email"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
