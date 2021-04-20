require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");

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
