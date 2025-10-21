const Movie = require("../models/movieModel");
const axios = require("axios");

/**
 * 🎬 Get all movies
 */
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error("Get All Movies Error:", err.message);
    res.status(500).json({ message: "Error fetching movies", error: err.message });
  }
};

/**
 * ⚡ Live movie name suggestions
 */
exports.getSuggestions = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json({ suggestions: [] });

    const regex = new RegExp(q.split(" ").join(".*"), "i");
    const suggestions = await Movie.find({ title: regex })
      .sort({ popularity: -1 })
      .limit(8)
      .select("title posterUrl releaseDate");

    res.json({ suggestions });
  } catch (err) {
    console.error("❌ Suggestion Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * 🎬 Search movies + AI recommendations
 */
exports.searchMovies = async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) {
      return res.status(400).json({ message: "Search query missing" });
    }

    const regex = new RegExp(q.split(" ").join(".*"), "i");
    const movies = await Movie.find({ title: regex }).limit(50);

    // 🎯 Similar movies (more partial matching)
    const similarMovies = await Movie.find({
      title: { $regex: q, $options: "i" },
    })
      .sort({ popularity: -1 })
      .limit(15);

    // 🧠 Call Flask ML service for AI recommendations
    const mlUrl = process.env.ML_SERVICE_URL;
    let recommendations = [];

    if (movies.length > 0 && mlUrl) {
      try {
        const favoriteGenre = movies[0].genres?.[0] || "Action";

        const mlResp = await axios.post(mlUrl, {
          favoriteGenre,
          query: q,
          topK: 10,
          candidates: movies.map((m) => ({
            _id: m._id,
            title: m.title,
            genres: m.genres,
            rating: m.rating,
          })),
        });

        if (mlResp.data?.recommendations) {
          recommendations = mlResp.data.recommendations;
        }
      } catch (err) {
        console.error("⚠️ ML Service Error:", err.message);
      }
    }

    res.status(200).json({
      results: movies,
      similar: similarMovies,
      recommendations,
    });
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/**
 * 🌟 Highlighted movies for homepage
 */
exports.getHighlightedMovies = async (req, res) => {
  try {
    const featured = await Movie.find({ featured: true }).limit(10);
    const topSearched = await Movie.find().sort({ searchCount: -1 }).limit(10);
    const recentlyAdded = await Movie.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      featured,
      topSearched,
      recentlyAdded,
    });
  } catch (err) {
    console.error("Highlight Error:", err.message);
    res.status(500).json({ message: "Failed to load highlighted movies", error: err.message });
  }
};

/**
 * 🧩 Admin - Add new movie
 */
exports.addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Error adding movie", error: err.message });
  }
};

/**
 * 🧩 Admin - Update movie
 */
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating movie", error: err.message });
  }
};

/**
 * 🧩 Admin - Delete movie
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting movie", error: err.message });
  }
};
