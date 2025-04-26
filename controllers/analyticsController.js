const workoutModel = require('../models/workoutModel');

exports.getWorkoutAnalytics = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Необхідно авторизуватися' });
    }

    const analytics = await workoutModel.getUserWorkoutAnalytics(req.user.id);
    
    res.json({
      success: true,
      analytics: {
        threeMonths: prepareChartData(analytics.threeMonths),
        sixMonths: prepareChartData(analytics.sixMonths),
        oneYear: prepareChartData(analytics.oneYear)
      }
    });
  } catch (err) {
    console.error('Помилка при отриманні аналітики:', err);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
};

function prepareChartData(data) {
  return {
    labels: data.map(item => formatDate(item.date)),
    weights: data.map(item => item.avgWeight),
    workoutCounts: data.map(item => item.workoutCount),
    durations: data.map(item => item.totalHours)
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}