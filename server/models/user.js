const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    pin: { type: String, default: "" },
    buf: { type: String, default: "" },
    locked: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    date: { type: Date, default: Date.now() },
});

const model = mongoose.model("User", UserSchema);

module.exports = model;
