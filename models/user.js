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
    admin: {
        type: Boolean,
        default: false,
    },
    posts: [{ body: String, date: Date }],
});

userSchema.statics.findByUsername = async (username) => {
    return this.find({ username });
};

module.exports = mongoose.model("User", userSchema);
