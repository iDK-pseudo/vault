const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    user: { type: String, required: true },
    cardnum: { type: String, required: true },
    cardnumLast4: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    cvv: { type: String, required: true },
    cardType: { type: String, required: true },
});

const model = mongoose.model("Card", CardSchema);

module.exports = model;
