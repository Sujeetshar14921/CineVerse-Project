const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, index: true, unique: true, sparse: true },
  title: { type: String, required: true },
  overview: String,
  genres: [String],
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  runtime: Number,
  rating: Number,
  videos: Array, // TMDb videos
  credits: { // optional
    cast: [{ id: Number, name: String, character: String }]
  },
  streamLinks: [{ source: String, url: String, quality: String, type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Text index for search
movieSchema.index({ title: "text", overview: "text", "credits.cast.name": "text" });

module.exports = mongoose.model('Movie', movieSchema);
