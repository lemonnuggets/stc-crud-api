const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessLevel: {
        type: Number,
        default: 0,
    },
});

userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};

module.exports = mongoose.model("User", userSchema);
