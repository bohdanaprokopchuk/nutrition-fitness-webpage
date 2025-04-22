const workoutModel = require('../models/workoutModel');

exports.getWorkoutAnalytics = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Необхідно авторизуватися' });
    }

    workoutModel.getUserWorkoutAnalytics(req.user.id, (err, analytics) => {
        if (err) {
            console.error('Помилка при отриманні аналітики:', err);
            return res.status(500).json({ success: false, message: 'Помилка сервера' });
        }
        
        res.json({ 
            success: true,
            analytics: {
                threeMonths: prepareChartData(analytics.threeMonths),
                sixMonths: prepareChartData(analytics.sixMonths),
                oneYear: prepareChartData(analytics.oneYear)
            }
        });
    });
};

// Підготовка даних для графіка
function prepareChartData(data) {
    return {
        labels: data.map(item => formatDate(item.date)),
        weights: data.map(item => item.avgWeight),
        workoutCounts: data.map(item => item.workoutCount),
        durations: data.map(item => item.totalHours)
    };
}

// Форматування даних
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}