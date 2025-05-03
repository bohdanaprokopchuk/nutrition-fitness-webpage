const db = require("../database");

module.exports = {
    // Збереження плану тренувань
    saveExercisePlan: function(userId, planData, callback) {
        const data = JSON.stringify(planData);
        const date = new Date().toISOString();

        console.log("Зберігаємо план тренувань:", { userId, planData });

        db.run(
            `INSERT INTO user_plans (user_id, plan_type, plan_data, saved_at) 
             VALUES (?, 'exercise', ?, ?)`,
            [userId, data, date],
            function(err) {
                if (err) {
                    console.error("Помилка при збереженні плану тренувань:", err.message);
                    return callback(err);
                }
                console.log("План тренувань успішно збережено.");
                callback(null);
            }
        );
    },

    // Збереження плану харчування
    saveDietPlan: function(userId, planData, callback) {
        const data = JSON.stringify(planData);
        const date = new Date().toISOString();

        console.log("Зберігаємо план харчування:", { userId, planData });

        db.run(
            `INSERT INTO user_plans (user_id, plan_type, plan_data, saved_at) 
             VALUES (?, 'diet', ?, ?)`,
            [userId, data, date],
            function(err) {
                if (err) {
                    console.error("Помилка при збереженні плану харчування:", err.message);
                    return callback(err);
                }
                console.log("План харчування успішно збережено.");
                callback(null);
            }
        );
    },

    // Поточні плани
    getCurrentPlans: function(userId, callback) {
        db.all(
            `WITH latest_plans AS (
                SELECT plan_type, MAX(saved_at) as latest_date
                FROM user_plans
                WHERE user_id = ?
                GROUP BY plan_type
             )
             SELECT up.plan_type, up.plan_data
             FROM user_plans up
             JOIN latest_plans lp ON up.plan_type = lp.plan_type AND up.saved_at = lp.latest_date
             WHERE up.user_id = ?`,
            [userId, userId],
            (err, rows) => {
                if (err) {
                    console.error("Помилка отримання поточних планів:", err.message);
                    return callback(err);
                }

                const plans = {
                    exercise: null,
                    diet: null
                };

                rows.forEach(row => {
                    try {
                        const planData = JSON.parse(row.plan_data);
                        if (row.plan_type === 'exercise') {
                            plans.exercise = planData;
                        } else if (row.plan_type === 'diet') {
                            plans.diet = planData;
                        }
                    } catch (parseErr) {
                        console.error("Помилка розбору JSON:", parseErr.message);
                    }
                });

                callback(null, plans);
            }
        );
    },

    // Повна історія планів
    getPlanHistory: function(userId, callback) {
        db.all(
            `SELECT 
                plan_type, 
                plan_data, 
                strftime('%Y-%m-%dT%H:%M:%SZ', saved_at) as saved_at 
             FROM user_plans 
             WHERE user_id = ? 
             ORDER BY saved_at DESC`,
            [userId],
            (err, rows) => {
                if (err) return callback(err);
                
                const result = {
                    exercise: [],
                    diet: []
                };
                
                rows.forEach(row => {
                    try {
                        const item = {
                            saved_at: row.saved_at,
                            data: JSON.parse(row.plan_data)
                        };
                        
                        if (row.plan_type === 'exercise') {
                            result.exercise.push(item);
                        } else if (row.plan_type === 'diet') {
                            result.diet.push(item);
                        }
                    } catch (e) {
                        console.error("Помилка парсингу:", e);
                    }
                });
                
                callback(null, result);
            }
        );
    }
};