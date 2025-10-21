// routes/recommendRoutes.js
const express = require("express");
const axios = require("axios");
const Movie = require("../models/movieModel");
const router = express.Router();

// 🔍 Search + AI Similar Recommendations
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ message: "Search query required" });

    // Step 1️⃣ — Find movies matching the query
    const foundMovies = await Movie.find({
      title: { $regex: query, $options: "i" },
    }).limit(1);

    if (foundMovies.length === 0)
      return res.status(404).json({ message: "No movies found" });

    const topMovie = foundMovies[0];

    // Step 2️⃣ — Fetch similar movies from Flask AI
    const flaskRes = await axios.post("http://localhost:5000/recommend", {
      movieTitle: topMovie.title,
      topK: 10,
    });

    res.status(200).json({
      searchedMovie: topMovie,
      similarMovies: flaskRes.data.similarMovies,
    });
  } catch (err) {
    console.error("❌ Search + Recommend Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
