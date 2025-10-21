import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    overview: "",
    releaseDate: "",
    posterUrl: "",
    rating: "",
    popularity: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch all movies
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/movies");
      setMovies(res.data.movies || res.data);
    } catch (err) {
      console.error("Error fetching movies", err);
    }
  };

  // 🧩 Add new movie
  const addMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/movies", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Movie added successfully!");
      setForm({ title: "", overview: "", releaseDate: "", posterUrl: "", rating: "", popularity: "" });
      fetchMovies();
    } catch (err) {
      alert("Error adding movie");
    }
  };

  // 🗑️ Delete movie
  const deleteMovie = async (id) => {
    if (!window.confirm("Are you sure to delete this movie?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMovies();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-red-500 mb-6">Admin Dashboard</h1>

      {/* Add Movie Form */}
      <form onSubmit={addMovie} className="bg-gray-800 p-5 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Add New Movie</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="p-2 bg-gray-700 rounded" placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="p-2 bg-gray-700 rounded" placeholder="Release Date" value={form.releaseDate}
            onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
          <input className="p-2 bg-gray-700 rounded" placeholder="Poster URL" value={form.posterUrl}
            onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
          <input className="p-2 bg-gray-700 rounded" placeholder="Rating" value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          <input className="p-2 bg-gray-700 rounded" placeholder="Popularity" value={form.popularity}
            onChange={(e) => setForm({ ...form, popularity: e.target.value })} />
        </div>
        <textarea className="mt-3 p-2 w-full bg-gray-700 rounded" placeholder="Overview" rows="3"
          value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })}></textarea>
        <button type="submit" className="mt-3 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
          ➕ Add Movie
        </button>
      </form>

      {/* Movie Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="p-3 border-b border-gray-700">Poster</th>
            <th className="p-3 border-b border-gray-700">Title</th>
            <th className="p-3 border-b border-gray-700">Rating</th>
            <th className="p-3 border-b border-gray-700">Popularity</th>
            <th className="p-3 border-b border-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id} className="hover:bg-gray-800">
              <td className="p-3">
                <img src={movie.posterUrl} alt={movie.title} className="w-16 rounded" />
              </td>
              <td className="p-3">{movie.title}</td>
              <td className="p-3">{movie.rating}</td>
              <td className="p-3">{movie.popularity}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteMovie(movie._id)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
