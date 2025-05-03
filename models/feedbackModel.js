const db = require("../database");

// Додаємо feedback до бази даних
exports.addFeedback = (email, message, callback) => {
    const query = `INSERT INTO feedback (email, message) VALUES (?, ?)`;
    db.run(query, [email, message], function (err) {
        if (err) {
            console.error("Error inserting feedback:", err.message);
            return callback(err);
        }
        callback(null, { id: this.lastID });
    });
};

// Отримуємо всі feedbacks
exports.getAllFeedbacks = (callback) => {
    const query = "SELECT * FROM feedback ORDER BY submitted_at DESC";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error fetching feedbacks:", err.message);
            return callback(err);
        }
        callback(null, rows);
    });
};
