const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    user: {type: String, required: true},
    bank: {type: String, required: true},
    cardnum: {type: Number, required: true},
    expires: {type: String, required: true},
    cvv: {type: Number, required: true}
})

const model = mongoose.model('Card', CardSchema);

module.exports = model;