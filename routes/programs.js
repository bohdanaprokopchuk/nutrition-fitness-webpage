const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("programs", { 
    title: "Тренування",
    user: req.user || null
  });
});

module.exports = router;