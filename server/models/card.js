const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    user: {type: String, required: true},
    cardnum: {type: Number, required: true},
    month: {type: Date, required: true},
    year: {type: Date, required: true},
    cvv: {type: String, required: true}
})

const model = mongoose.model('Card', CardSchema);

module.exports = model;