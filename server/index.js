const express = require("express");
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const path = require("path");
const passport = require('passport');
const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const User = require('./models/user');
const Card = require('./models/card');
const isAuth = require('./utils/authMiddleware').isAuth;
var cardValidator = require("card-validator");
const PassportHelper = require('./utils/passportUtil');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();
const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster-shard-00-00.kxtke.mongodb.net:27017,firstcluster-shard-00-01.kxtke.mongodb.net:27017,firstcluster-shard-00-02.kxtke.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-9qr6zu-shard-0&authSource=admin&retryWrites=true&w=majority`;

let lastEnteredId = null;

mongoose.connect(MONGODB_URI);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(passport.initialize());

app.use(passport.session());

PassportHelper.initializePassport();

app.post('/login',
  check('username').isEmail().normalizeEmail().trim().escape(),
  check('password').trim().escape(),
  (req, res, next) => {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      PassportHelper.passportAuthenticate(req, res, next);
    }
  }
);

app.post('/lockedlogin',
  check('username').isEmail().normalizeEmail().trim().escape(),
  check('password').trim().escape(),
  check('pin').isNumeric({no_symbols: true}).isLength({min: 6, max: 6}).trim().escape(),
  (req, res, next) => {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      PassportHelper.passportAuthenticate(req, res, next);
    }
  }
);

app.post('/signup',
  check('email').isEmail().normalizeEmail().trim().escape(),
  check('password').isStrongPassword().trim().escape(),
  check('pin').isNumeric({no_symbols: true}).isLength({min: 6, max: 6}).trim().escape(),
  async (req,res) => {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      const buf =  crypto.randomBytes(32);
      const hashedPassword = crypto.pbkdf2Sync(req.body.password, buf, 310000, 32, 'sha256');
      const hashedPin = crypto.pbkdf2Sync(req.body.pin, buf, 310000, 32, 'sha256');
      try
       {
        const mongoRes = await User.create({
          _id: req.body.email,
          email: req.body.email, 
          password: hashedPassword.toJSON().data,
          pin: hashedPin.toJSON().data,
          buf: buf.toJSON().data
        })
        console.log(`A user was inserted with the _id: ${mongoRes._id}`);
        res.send({success: true});
      }catch (ex){
        if(ex.errmsg.includes('duplicate')){
          res.send({success: false, errors: [{ param: 'duplicate-email', msg: 'User already exists'}]})
        }else{
          res.send({success: false, errors: [{ param: 'server-issue', msg: 'Server issue'}]});
        }
      }
    }else{
      res.send({success: false, ...errorsResult});
    }
  }
)

app.post('/logout', isAuth,
  (req, res)=> {
    req.logout();
    res.send({loggedOut: true});
})

app.post('/verifyPin',
  isAuth,
  check('pin').isNumeric({no_symbols: true}).isLength({min: 6, max: 6}).trim().escape(),
  async (req, res)=> {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      const foundUser = await User.findOne({email: req.user});
      if(!foundUser) res.send({success: false});
      const hashedPin = crypto.pbkdf2Sync(req.body.pin, Buffer.from(foundUser.buf), 310000, 32, 'sha256');
      if (!crypto.timingSafeEqual(Buffer.from(foundUser.pin), hashedPin)) {
        res.send({success: false});
      }else{
        res.send({success: true});
      }
    }else{
      res.send({success: false});
    }
  }
)

app.post("/api", isAuth,
  check('cardnum').trim().escape(),
  check('month').trim().escape(),
  check('year').trim().escape(),
  check('cvv').trim().escape(),
  async (req, res) => {
    const {cardnum, month, year, cvv} = req.body;
    const numberValid = cardValidator.number(cardnum);
    const isMonthValid = cardValidator.expirationMonth(month).isValid;
    const isYearValid = cardValidator.expirationYear(year).isValid;
    const isCvvValid = cardValidator.cvv(cvv).isValid;
    if (numberValid.isValid && isMonthValid && isYearValid && isCvvValid) {
      const mongoRes = await Card.create({user: req.user, ...req.body, cardType: numberValid.card.niceType});
      lastEnteredId = mongoRes._id.toString();
      console.log(`A document was inserted with the _id: ${mongoRes._id}`);
      res.send({success: true});
    }else{
      res.send({
        success: false, 
        errors: [
          {
            param: "cardnum", 
            valid: numberValid.isValid
          },
          {
            param: "month", 
            valid: isMonthValid
          },
          {
            param: "year", 
            valid: isYearValid
          },
          {
            param: "cvv", 
            valid: isCvvValid
          }
        ]
      });
    }
  }
);

app.get('/lastcard', isAuth,
  async (req,res) => {
      let entry = await Card.find({user: req.user, _id: lastEnteredId}).limit(1);
      res.send({entry});
  }
)

app.get('/cards', isAuth,
  async (req,res) => {
      let entries = await Card.find({user: req.user});
      if(entries.length === 0){
        entries = [
          {
            bank: "-",
            cardnum: "-"
          }
        ]
      }
      res.send({entries});
  }
)

app.get('/verify', 
  (req, res)=> {
    if(req.isAuthenticated()){
      res.send({isLoggedIn: true});
    }else{
      res.send({isLoggedIn: false});
    }
  })

app.get('/lockuser', isAuth,
  async (req, res)=>{
    const mongoRes = await User.updateOne({email: req.user}, {locked: true});
    if(mongoRes.modifiedCount>0){
      req.logout();
      res.send({success: true});
    }else{
      res.send({success: false});
    }
  }
)

app.use(express.static(path.join(__dirname, "../build/")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/', 'index.html'));
});
  
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});