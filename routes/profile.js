const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Профіль" });
});

router.post("/add", (req, res) => {
    res.render("index", { title: "Профіль додати" });
  });

module.exports = router;