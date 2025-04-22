const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("calculator", { 
    title: "Розрахунок ІМТ",
    user: req.user || null
   });
});

module.exports = router;
