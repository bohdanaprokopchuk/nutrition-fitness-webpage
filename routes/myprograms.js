const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("myprograms", { 
    title: "Мій індивідуальний план",
    user: req.user || null
  });
});

module.exports = router;