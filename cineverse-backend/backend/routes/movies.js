const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middlewares/auth');

router.get('/', movieController.listMovies);        // public: pagination, search, filter
router.get('/:id', movieController.getMovieById);  // public detail
router.post('/:id/watch', auth, movieController.addWatch); // protected
router.post('/:id/like', auth, movieController.likeMovie); // protected
router.post('/:id/rate', auth, movieController.rateMovie); // protected (simple impl)

module.exports = router;
