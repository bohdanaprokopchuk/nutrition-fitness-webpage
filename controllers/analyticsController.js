const workoutModel = require('../models/planModel');

exports.getPlanHistory = (req, res) => {
  const userId = req.user.id;

  planModel.getPlanHistory(userId, (err, history) => {
    if (err) {
      console.error("Помилка отримання історії:", err.message);
      return res.status(500).json({ error: 'Помилка отримання історії' });
    }
    res.json(history);
  });
};