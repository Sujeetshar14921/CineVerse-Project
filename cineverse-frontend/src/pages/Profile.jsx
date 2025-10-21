import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch current user data
  useEffect(() => {
    if (user && user.token) {
      axios
        .get("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [user]);

  // ✅ Handle field change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8000/api/users/update-profile",
        userData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessage(res.data.message || "Profile updated successfully!");
    } catch (err) {
      setMessage("Error updating profile!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-red-500 mb-2">
          My Profile
        </h2>

        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 rounded-md text-black"
        />

        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 rounded-md text-black"
          disabled
        />

        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-2 rounded-md text-black"
        />

        <input
          type="text"
          name="address"
          value={userData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 rounded-md text-black"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 rounded-md py-2 font-semibold duration-200"
        >
          Update Profile
        </button>

        {message && (
          <p className="text-center text-green-400 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Profile;
