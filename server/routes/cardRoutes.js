const express = require("express");
const router = express.Router();
const isAuth = require('../utils/authMiddleware').isAuth;
const { check } = require('express-validator');
const cardController = require("../controllers/cardController");

router.post("/create_card", 
  isAuth,
  check('cardnum').trim().escape(),
  check('month').trim().escape(),
  check('year').trim().escape(),
  check('cvv').trim().escape(),
  cardController.create_card
);

router.get('/last_card', isAuth, cardController.last_card);

router.get('/cardlist', isAuth, cardController.cardlist);

module.exports = router;