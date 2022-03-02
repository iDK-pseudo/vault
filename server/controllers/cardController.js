const cardValidator = require("card-validator");
const Card = require("../models/card");
const CryptoHelper = require("../utils/cryptoUtil");

exports.create_card = async function (req, res, next) {
    const { cardnum, month, year, cvv } = req.body;
    const numberValid = cardValidator.number(cardnum);
    const isMonthValid = cardValidator.expirationMonth(month).isValid;
    const isYearValid = cardValidator.expirationYear(year).isValid;
    const isCvvValid = cardValidator.cvv(cvv).isValid;
    if (numberValid.isValid && isMonthValid && isYearValid && isCvvValid) {
        const eData = CryptoHelper.eCardDetails({
            ...req.body,
            cardnumLast4: req.body.cardnum.slice(-4),
            cardType: numberValid.card.niceType,
        });
        await Card.create({ user: req.user, ...eData });
        res.send({ success: true });
    } else {
        res.send({
            success: false,
            errors: [
                { param: "cardnum", valid: numberValid.isValid },
                { param: "month", valid: isMonthValid },
                { param: "year", valid: isYearValid },
                { param: "cvv", valid: isCvvValid },
            ],
        });
    }
};

exports.last_card = async function (req, res, next) {
    const entry = await Card.find({ user: req.user })
        .sort({ _id: -1 })
        .limit(1);
    const dEntry = CryptoHelper.dCardDetails(
        entry,
        req.session[req.user].unlocked
    );
    res.send({ entry: dEntry });
};

exports.cardlist = async function (req, res, next) {
    const entries = await Card.find({ user: req.user }).lean();
    const dEntries = CryptoHelper.dCardDetails(
        entries,
        req.session.passport.restrict
    );
    res.send({ entries: dEntries });
};
