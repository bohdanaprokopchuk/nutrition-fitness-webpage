// routes/feedback.js
const express = require('express');
const router = express.Router();
const { addFeedback, getAllFeedbacks } = require("../models/feedbackModel");

//Надіслати фідбек
router.post("/", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Порожнє поле email або повідомлення" });
  }

  try {
    await addFeedback(email, message);
    res.status(200).json({ success: "Повідомлення успішно надіслано" });
  } catch (err) {
    res.status(500).json({ error: "Повідомлення не вдалося надіслати" });
  }
});

//Отримати фідбек
router.get("/", async (req, res) => {
  try {
    const feedbacks = await getAllFeedbacks();
    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося отримати повідомлення" });
  }
});

module.exports = router;

