const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("No user id passed in");
});

module.exports = router;
