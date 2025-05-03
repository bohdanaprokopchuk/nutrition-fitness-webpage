const express = require('express');
const router = express.Router();
const planModel = require('../models/planModel');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/history', isAuthenticated, (req, res) => {
    planModel.getPlanHistory(req.user.id, (err, history) => {
        if (err) {
            console.error("Помилка отримання історії:", err);
            return res.status(500).json({ 
                error: 'Помилка сервера',
                details: err.message 
            });
        }
        
        if (!history.exercise) history.exercise = [];
        if (!history.diet) history.diet = [];
        
        res.json(history);
    });
});

module.exports = router;