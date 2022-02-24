const cardValidator = require('card-validator');
const Card = require('../models/card');

exports.create_card = async function (req, res, next){
    const {cardnum, month, year, cvv} = req.body;
    const numberValid = cardValidator.number(cardnum);
    const isMonthValid = cardValidator.expirationMonth(month).isValid;
    const isYearValid = cardValidator.expirationYear(year).isValid;
    const isCvvValid = cardValidator.cvv(cvv).isValid;
    if (numberValid.isValid && isMonthValid && isYearValid && isCvvValid) {
        await Card.create({user: req.user, ...req.body, cardType: numberValid.card.niceType});
        res.send({success: true});
    }else{
        res.send({
            success: false, 
            errors: [{param: "cardnum", valid: numberValid.isValid},{param: "month", valid: isMonthValid},{param: "year", valid: isYearValid},{param: "cvv", valid: isCvvValid}]
        });
    }
}

exports.last_card = async function (req, res, next){
    let entry = await Card.find({user: req.user}).sort({_id:-1}).limit(1);
    res.send({entry});
}

exports.cardlist = async function (req, res, next){
    let entries = await Card.find({user: req.user});
    res.send({entries});
}