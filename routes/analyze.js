const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("analytics", { 
    title: "Програма",
    user: req.user || null
 });
});

module.exports = router;