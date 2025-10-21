const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const adminController = require('../controllers/adminController');

router.post('/import/:tmdbId', auth, admin, adminController.importByTmdbId);

// Manual CRUD
router.post('/movies', auth, admin, adminController.createMovie);
router.put('/movies/:id', auth, admin, adminController.updateMovie);
router.delete('/movies/:id', auth, admin, adminController.deleteMovie);

module.exports = router;
