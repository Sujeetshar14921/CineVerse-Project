import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // email passed from Register

  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/verify-otp", {
        email,
        otp,
      });
      alert("✅ Email verified successfully!");
      navigate("/login-user");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Invalid or expired OTP");
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    try {
      setResending(true);
      await axios.post("http://localhost:8000/api/auth/register", {
        email, // trigger resend OTP
      });
      setMessage("📩 New OTP sent to your email!");
    } catch (err) {
      setMessage("❌ Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Verify Your Email</h2>

      <form
        onSubmit={handleVerify}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-80"
      >
        <p className="text-gray-400 text-sm mb-3">
          Enter the OTP sent to your email: <br />
          <span className="text-blue-400">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none text-center tracking-widest text-lg"
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
        >
          Verify OTP
        </button>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className={`text-blue-400 hover:text-blue-300 text-sm ${
              resending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
          {message && <p className="text-gray-400 text-xs mt-2">{message}</p>}
        </div>
      </form>
    </div>
  );
}
