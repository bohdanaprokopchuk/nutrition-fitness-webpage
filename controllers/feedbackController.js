const { addFeedback, getAllFeedbacks } = require('../models/feedbackModel');

const submitFeedback = async (email, message) => {
  if (!email || !message) {
    throw new Error("Email and message are required");
  }

  await addFeedback(email, message);
};

const getFeedbacks = async () => {
  return await getAllFeedbacks();
};

module.exports = { submitFeedback, getFeedbacks };

