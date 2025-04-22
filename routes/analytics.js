const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, analyticsController.getWorkoutAnalytics);

module.exports = router;