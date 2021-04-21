const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { authenticateToken } = require("./auth");

router.get("/", authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    res.status(200).json(req.user);
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).json({ message: "Successfully deleted user" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", authenticateToken, async (req, res) => {
    if (req.body.username !== undefined) {
        req.user.username = req.body.username;
    }
    if (req.body.name !== undefined) {
        req.user.name = req.body.name;
    }
    if (req.body.password !== undefined) {
        req.user.password = req.body.password;
    }
    try {
        const newUser = await req.user.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        accessLevel: req.body.accessLevel,
        username: req.body.username,
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports.usersRouter = router;
