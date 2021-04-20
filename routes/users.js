require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
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
        const user = await User.findByUsername(req.params.username);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        admin: req.body.admin,
        username: req.body.username,
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
