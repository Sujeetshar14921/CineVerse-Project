const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const axios = require('axios');

router.get('/', auth, async (req, res) => {
  try {
    const ML = process.env.ML_SERVICE_URL || 'http://localhost:6000';
    const userId = req.user.id;
    const n = req.query.n || 10;
    const resp = await axios.get(`${ML}/user/${userId}?n=${n}`);
    // resp.data contains movieIds; enrich with movie docs
    const movieIds = resp.data.recs?.map(r => r.movieId) || [];
    // fetch movies from DB
    const Movie = require('../models/Movie');
    const movies = await Movie.find({ _id: { $in: movieIds } }).lean();
    // maintain order as returned
    const ordered = movieIds.map(id => movies.find(m => String(m._id) === String(id))).filter(Boolean);
    res.json({ recs: resp.data.recs, movies: ordered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Recommendation fetch failed' });
  }
});

module.exports = router;
