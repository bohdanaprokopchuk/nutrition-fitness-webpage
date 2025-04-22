const db = require("../database");

module.exports = {
    saveExercisePlan: function(userId, planData, callback) {
        const data = JSON.stringify(planData);
        const date = new Date().toISOString();

        console.log("Зберігаємо план тренувань:", { userId, planData });

        db.run(
            `INSERT INTO user_plans (user_id, plan_type, plan_data, saved_at) 
             VALUES (?, 'exercise', ?, ?)
             ON CONFLICT(user_id, plan_type) 
             DO UPDATE SET plan_data = excluded.plan_data, saved_at = excluded.saved_at`,
            [userId, data, date],
            function(err) {
                if (err) {
                    console.error("Помилка при збереженні плану тренувань:", err.message);
                } else {
                    console.log("План тренувань успішно збережено або оновлено.");
                }
                callback(err);
            }
        );
    },

    saveDietPlan: function(userId, planData, callback) {
        const data = JSON.stringify(planData);
        const date = new Date().toISOString();

        console.log("Зберігаємо план харчування:", { userId, planData });

        db.run(
            `INSERT INTO user_plans (user_id, plan_type, plan_data, saved_at) 
             VALUES (?, 'diet', ?, ?)
             ON CONFLICT(user_id, plan_type) 
             DO UPDATE SET plan_data = excluded.plan_data, saved_at = excluded.saved_at`,
            [userId, data, date],
            function(err) {
                if (err) {
                    console.error("Помилка при збереженні плану харчування:", err.message);
                } else {
                    console.log("План харчування успішно збережено або оновлено.");
                }
                callback(err);
            }
        );
    },

    getPlans: function(userId, callback) {
        db.all(
            `SELECT plan_type, plan_data FROM user_plans WHERE user_id = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    console.error("Помилка отримання планів:", err.message);
                    return callback(err);
                }

                const plans = {
                    exercise: null,
                    diet: null
                };

                rows.forEach(row => {
                    try {
                        if (row.plan_type === 'exercise') {
                            plans.exercise = JSON.parse(row.plan_data);
                        } else if (row.plan_type === 'diet') {
                            plans.diet = JSON.parse(row.plan_data);
                        }
                    } catch (parseErr) {
                        console.error("Помилка розбору JSON:", parseErr.message);
                    }
                });

                callback(null, plans);
            }
        );
    }
};
