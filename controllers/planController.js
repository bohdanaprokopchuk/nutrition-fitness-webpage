const planModel = require('../models/planModel');

exports.saveExercisePlan = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Не авторизований' });
    }

    planModel.saveExercisePlan(
        req.user.id,
        req.body.planData,
        (err) => {
            if (err) {
                console.error('Помилка збереження плану тренувань:', err);
                return res.status(500).json({ success: false, message: 'Помилка сервера' });
            }
            res.json({ success: true, message: 'План тренувань збережено' });
        }
    );
};

exports.saveDietPlan = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Не авторизований' });
    }

    planModel.saveDietPlan(
        req.user.id,
        req.body.planData,
        (err) => {
            if (err) {
                console.error('Помилка збереження плану харчувань:', err);
                return res.status(500).json({ success: false, message: 'Помилка сервера' });
            }
            res.json({ success: true, message: 'План харчування збережено' });
        }
    );
};

exports.getUserPlans = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Не авторизований' });
    }

    planModel.getCurrentPlans(
        req.user.id,
        (err, plans) => {
            if (err) {
                console.error('Помилка отримання планів:', err);
                return res.status(500).json({ success: false, message: 'Помилка сервера' });
            }
            res.json({ success: true, plans });
        }
    );
};