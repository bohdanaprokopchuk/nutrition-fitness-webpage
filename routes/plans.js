const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("plans", { 
    title: "Харчування",
    user: req.user || null
 });
});

module.exports = router;