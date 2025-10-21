const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// ⚡ Live Search Suggestions
router.get("/suggestions", movieController.getSuggestions);

// 🔍 Search movies
router.get("/search", movieController.searchMovies);

// 🎬 Get all movies
router.get("/", movieController.getAllMovies);

// 🌟 Highlighted movies (for homepage)
router.get("/highlighted", movieController.getHighlightedMovies);

// 🧩 Admin-only
router.post("/", movieController.addMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
