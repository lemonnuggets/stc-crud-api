const express = require("express");
const router = express.Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.id);
        if (user === null) {
            return res.status(404).json({ message: "No such user" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getUserByUsername = async (req, res, next) => {
    try {
        const user = await User.findByUsername(req.body.username);
        if (user === null) {
            return res.status(404).json({ message: "No such user" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const authenticateToken = async (req, res, next) => {
    const token = req.headers["auth-token"];
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
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
    );
    const refreshToken = jwt.sign(
        { id: req.user.id },
        process.env.REFRESH_TOKEN_SECRET
    );
    try {
        req.user.refreshTokens = [...req.user.refreshTokens, refreshToken];
        await req.user.save();
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/logout", getUserById, async (req, res) => {
    const token = req.headers["refresh-token"];
    try {
        if (!req.user.refreshTokens.includes(token))
            return res.status(401).json({ message: "Invalid refresh token" });
        req.user.refreshTokens = req.user.refreshTokens.filter(
            (savedToken) => savedToken !== token
        );
        await req.user.save();
        res.status(200).json({ message: "Successfully logged out user" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/refresh", getUserById, async (req, res) => {
    const token = req.headers["refresh-token"];
    try {
        if (!req.user.refreshTokens.includes(token))
            return res.status(401).json({ message: "Invalid refresh token" });
        const accessToken = jwt.sign(
            { id: req.user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
        );
        res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.authRouter = router;
module.exports.authenticateToken = authenticateToken;
