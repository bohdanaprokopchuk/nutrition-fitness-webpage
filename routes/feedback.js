const express = require('express');
const router = express.Router();
const Feedback = require("../models/feedbackModel");

// Надіслати фідбек
router.post("/", (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: "Порожнє поле email або повідомлення" });
    }

    Feedback.addFeedback(email, message, (err) => {
        if (err) {
            console.error("Помилка при надсиланні фідбеку:", err.message);
            return res.status(500).json({ error: "Повідомлення не вдалося надіслати" });
        }
        res.status(200).json({ success: "Повідомлення успішно надіслано" });
    });
});

// Отримати фідбек
router.get("/", (req, res) => {
    Feedback.getAllFeedbacks((err, feedbacks) => {
        if (err) {
            console.error("Помилка при отриманні фідбеків:", err.message);
            return res.status(500).json({ error: "Не вдалося отримати повідомлення" });
        }
        res.status(200).json({ feedbacks });
    });
});

module.exports = router;
