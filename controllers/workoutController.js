const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel.js');

exports.startWorkout = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Необхідно авторизуватись' });
    }

    const weight = parseFloat(req.body.weight);
    if (isNaN(weight)) {
        return res.status(400).json({ success: false, message: 'Введіть коректну вагу' });
    }

    workoutModel.startWorkout(req.user.id, weight, (err, workoutId) => {
        if (err) {
            console.error('Помилка при старті тренування:', err);
            return res.status(500).json({ success: false, message: 'Помилка сервера' });
        }
        res.json({ success: true, workoutId });
    });
};

exports.getWorkoutHistory = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Необхідно авторизуватись' });
    }

    const period = req.query.period || 'week';
    
    workoutModel.getUserWorkoutHistory(req.user.id, period, (err, workouts) => {
        if (err) {
            console.error('Помилка при отриманні історії тренувань:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Помилка сервера при отриманні історії тренувань' 
            });
        }

        res.json({ 
            success: true,
            workouts
        });
    });
};

exports.endWorkout = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Необхідно авторизуватись' });
    }

    const workoutId = req.body.id;
    const newWeight = parseFloat(req.body.weight);

    console.log('Тип newWeight:', typeof newWeight); 
    console.log('Значення newWeight:', newWeight);

    if (isNaN(newWeight)) {
        return res.status(400).json({ success: false, message: 'Некоректне значення ваги' });
    }

    workoutModel.endWorkout(workoutId, (err) => {
        if (err) {
            console.error('Помилка при завершенні тренування:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Помилка сервера при завершенні тренування' 
            });
        }

        userModel.updateCurrentWeight(req.user.id, newWeight, (err) => {
            if (err) {
                console.error('Помилка при оновленні ваги:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Помилка сервера при оновленні ваги' 
                });
            }

            res.json({ 
                success: true,
                message: 'Тренування завершено та вагу оновлено',
                newWeight
            });
        });
    });
};
