const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
    type: {type: String},
    data: {type: []}
})

const UserSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: PasswordSchema, required: true},
    date: {type: Date, default: Date.now()}
});


const model = mongoose.model('User',UserSchema);

module.exports = model;