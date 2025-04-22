const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("locator", {
    title: "Локатор спортзалів",
    user: req.user || null,
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  });
});

module.exports = router;
