import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromLink = location.state?.email || "";

  const [email, setEmail] = useState(emailFromLink);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  // 🧩 Reset Password using OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/reset-password-otp", {
        email,
        otp,
        newPassword,
      });
      alert("✅ Password reset successful!");
      navigate("/login-user");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error resetting password");
    }
  };

  // 🔁 Resend OTP function
  const handleResendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email to resend OTP.");
      return;
    }
    try {
      setResending(true);
      await axios.post("http://localhost:8000/api/auth/request-reset-otp", { email });
      setMessage("📩 New OTP sent to your email!");
    } catch (err) {
      setMessage("❌ Failed to resend OTP. Try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Reset Password</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-80"
      >
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
        />

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className={`text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 transition ${
              resending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-sm text-center text-gray-300 mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
