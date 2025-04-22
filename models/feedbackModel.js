const db = require("../database");

// Додаємо feedback до бази даних
const addFeedback = (email, message) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO feedback (email, message) VALUES (?, ?)`;
    db.run(query, [email, message], function (err) {
      if (err) {
        console.error("Error inserting feedback:", err.message);
        return reject(err);
      }
      resolve({ id: this.lastID });
    });
  });
};

// Отримуємо feedback
const getAllFeedbacks = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM feedback ORDER BY submitted_at DESC";
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching feedbacks:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports = { addFeedback, getAllFeedbacks };

