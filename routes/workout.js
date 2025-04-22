const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/start', isAuthenticated, workoutController.startWorkout);
router.post('/end/:id', isAuthenticated, workoutController.endWorkout);
router.get('/history', isAuthenticated, workoutController.getWorkoutHistory);

module.exports = router;