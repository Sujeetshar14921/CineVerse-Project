import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Recommendations from "./pages/Recommendations";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import OtpVerify from "./pages/OtpVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import LoginUser from "./pages/LoginUser";
import LoginAdmin from "./pages/LoginAdmin";

export default function App() {
  return (
    <div className="min-h-screen bg-cinebg text-white">
      <Navbar />
      <Routes>
        {/* 🌍 Public + User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />

        {/* 🔐 Forgot + Reset Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* ✅ OTP based reset (no token param) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 👥 Admin & User Login */}
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* 📊 Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* ✅ Removed UserDashboard - Home works as user dashboard */}

        {/* ⚙️ Other Pages */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🧭 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" />
    </div>
  );
}
