const Feedback = require('../models/feedbackModel');

// Надіслати відгук
exports.submitFeedback = (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).send("Email and message are required");
    }

    Feedback.addFeedback(email, message, (err) => {
        if (err) {
            return res.status(500).send("Failed to submit feedback");
        }
        res.status(201).send("Feedback submitted successfully");
    });
};

// Отримати всі відгуки
exports.getFeedbacks = (req, res) => {
    Feedback.getAllFeedbacks((err, feedbacks) => {
        if (err) {
            return res.status(500).send("Failed to retrieve feedbacks");
        }
        res.render("feedbacks", {
            feedbacks,
            user: req.user || null
        });
    });
};
