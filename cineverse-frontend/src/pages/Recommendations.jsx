// src/pages/Recommendations.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Recommendations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/api/movies/highlighted");
        setData([...res.data.featured, ...res.data.topSearched]);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-bold">🎬 Recommended Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((m) => (
          <div key={m._id} className="bg-gray-800 p-3 rounded">
            <h3 className="font-semibold">{m.title}</h3>
            <p className="text-sm text-gray-400">{m.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
