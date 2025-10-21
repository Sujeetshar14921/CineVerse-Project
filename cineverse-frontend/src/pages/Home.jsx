import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchHighlighted();
  }, []);

  // 🎬 Load highlighted movies (featured + topSearched + recentlyAdded)
  const fetchHighlighted = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/movies/highlighted");
      setMovies(res.data.featured || []);
      setRecommendations(res.data.topSearched || []);
      setRecentMovies(res.data.recentlyAdded || []);
    } catch (err) {
      console.error("Error fetching highlighted movies", err);
    }
  };

  // 🔍 Search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchHighlighted();

    try {
      const res = await axios.get(`http://localhost:8000/api/movies/search?q=${query}`);
      setMovies(res.data.results || []);
      setRecommendations(res.data.recommendations || []);
      setShowDropdown(false);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // ⚡ Live search suggestions
  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/movies/suggestions?q=${text}`);
      setSuggestions(res.data.suggestions || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const handleSelectSuggestion = (title) => {
    setQuery(title);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6 text-center"></h1>

      {/* 🔎 Search Bar */}
      <div className="relative flex justify-center mb-8">
        <form onSubmit={handleSearch} className="flex w-1/2">
          <input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => fetchSuggestions(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full p-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 px-4 py-2 rounded-r-lg hover:bg-red-700 transition"
          >
            Search
          </button>
        </form>

        {/* ⚡ Dropdown Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 bg-gray-800 border border-gray-700 w-1/2 rounded-lg max-h-60 overflow-y-auto shadow-lg z-10">
            {suggestions.map((s) => (
              <li
                key={s._id}
                onClick={() => handleSelectSuggestion(s.title)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer transition"
              >
                <img
                  src={s.posterUrl}
                  alt={s.title}
                  className="w-10 h-14 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.releaseDate}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌟 Featured Movies */}
      <h2 className="text-xl font-semibold mb-3 text-red-400"></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 p-3 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-md mb-2 w-full h-60 object-cover"
              />
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.releaseDate}</p>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {/* 🆕 Recently Added Movies */}
      <h2 className="text-xl font-semibold mt-10 mb-3 text-red-500">
        Recently Added Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {recentMovies.length > 0 ? (
          recentMovies.map((movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 p-3 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-md mb-2 w-full h-60 object-cover"
              />
              <h3 className="text-lg font-semibold">{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>No recent movies found.</p>
        )}
      </div>

      {/* 💡 Top Searched Movies */}
      <h2 className="text-xl font-semibold mt-10 mb-3 text-blue-500">
        Most Searched Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {recommendations.length > 0 ? (
          recommendations.map((movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 p-3 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-md mb-2 w-full h-60 object-cover"
              />
              <h3 className="text-lg font-semibold">{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>No top searched movies found.</p>
        )}
      </div>
    </div>
  );
}
