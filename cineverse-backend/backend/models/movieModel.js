// movieModel.js

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number},
    title: String,
    overview: String,
    releaseDate: String,
    posterUrl: String,
    rating: Number,
    popularity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
