require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const getUserByUsername = async (req, res, next) => {
    try {
        const user = await User.findByUsername(req.body.username);
        if (user === 0) {
            return res.status(404).json({ message: "No such user" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const authenticateToken = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (token === null)
        return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) return res.sendStatus(403);
        try {
            const user = await User.findById(data.id);
            if (user === 0) {
                return res.status(404).json({ message: "No such user" });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
};
router.post("/login", getUserByUsername, async (req, res) => {
    if (req.body.password !== req.user.password)
        return res.status(401).json({ message: "Incorrect password" });
    const accessToken = jwt.sign(
        { id: req.user.id },
        process.env.ACCESS_TOKEN_SECRET
    );
    res.status(200).json({ accessToken });
});

module.exports.authRouter = router;
module.exports.authenticateToken = authenticateToken;
