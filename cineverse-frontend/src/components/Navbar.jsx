import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // 👈 user/admin icon

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 'user' or 'admin'
  const isAdmin = role === "admin";
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login-user");
  };

  const handleLogin = () => {
    navigate("/login-user");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md relative">
      {/* 🔴 Logo */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors"
        >
          CineVerse
        </Link>

        {/* 🔗 Home link only */}
        <Link to="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
      </div>

      {/* 🔘 Right Side */}
      <div className="flex items-center space-x-3 relative">
        {!token ? (
          <>
            <button
              onClick={handleLogin}
              className="bg-red-600 px-4 py-1.5 rounded text-white font-semibold hover:bg-red-700 transition"
            >
              Login
            </button>

            <Link
              to="/register"
              className="border border-red-600 px-4 py-1.5 rounded text-red-500 font-semibold hover:bg-red-600 hover:text-white transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* 👤 User/Admin Icon + Label */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaUserCircle className="text-2xl hover:text-red-400 transition" />
              {isAdmin && (
                <span className="text-sm font-semibold text-red-400">
                  Admin
                </span>
              )}
            </div>

            {/* ⬇️ Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/admin-dashboard");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      Admin Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      My Profile
                    </button>
                  </>
                )}
                <hr className="border-gray-600" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
