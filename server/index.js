const express = require("express");
const { body, check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const path = require("path");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster.kxtke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true`;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(session({
  secret: process.env.USER_SALT,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { secure: false }
}))

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(verify = async (email, password, cb) => {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const database = client.db('banking');
      const userdata = database.collection('userdata');
      const result = await userdata.findOne({email: email});
      crypto.pbkdf2(password, process.env.USER_SALT, 310000, 32, 'sha256', (err, hashedPassword) => {
        if(!result) return cb(null, false, { message: 'Incorrect email or password.' });
        const bufferedPass = Buffer.from(result.password.data);
        if (Buffer.isBuffer(bufferedPass) && !crypto.timingSafeEqual(bufferedPass, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect email or password.' });
        }else{
          return cb(null, email);
        }
      });
    } finally {
      await client.close();
    }
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.post('/login',
  function(req, res,next) {
    passport.authenticate('local', (err, user, options)=>{
      if(user){
        req.logIn(user, (err)=>{
        });
        res.send({success:true});
      }else{
        res.send({success:false, ...options});
      }
    })(req,res,next);
  }
);

app.post('/signup',
  check('email','Please enter valid email').isEmail().normalizeEmail().trim().escape(),
  check('password','Password must contain atleast 8 chars, 1 Lowercase, 1 Uppercase, 1 Number, 1 Special Character')
    .isStrongPassword()
    .trim()
    .escape(),
  (req,res) => {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      crypto.pbkdf2(req.body.password, process.env.USER_SALT, 310000, 32, 'sha256', async (err, hashedPassword) => {
        const client = new MongoClient(MONGODB_URI);
        try {
          await client.connect();
          const database = client.db('banking');
          const userdata = database.collection('userdata');
          const result = await userdata.insertOne({_id: req.body.email, email: req.body.email, password: hashedPassword.toJSON()});
          console.log(`A user was inserted with the _id: ${result.insertedId}`);
        } finally {
          await client.close();
          res.send({success: true});
        }
      });
    }else{
      res.send({success: false, ...errorsResult});
    }
  }
)

app.post("/api", 
  body('bank','Bank must be non-empty, contain only Alphabets, Numbers').isAlphanumeric('en-US',{ignore: ' '}).trim(),
  check('cardnum', 'Card number must be 16 Characters long').isNumeric().isLength({min: 16, max: 16}).trim().escape(),
  check('expires','Please enter a valid Month-Year').not().isEmpty(),
  check('cvv','CVV must be 3 chars long').isNumeric().isLength({min: 3, max: 3}).trim().escape(),
  (req, res) => {
    const errorsResult = validationResult(req);
    if (!errorsResult.isEmpty()) {
      const payload = {};
      errorsResult.errors.forEach((error)=>{
        payload[error.param] = {value: req.body[error.param], showError: true, errorMsg: error.msg};
      })
      res.send(payload);
    }else{
      writeToDB(req.body);
      res.send({success: true});
    }
  }
);

app.get('/api',
  async (req,res) => {
    const entries = await readEntriesFromDB();
    res.send(entries);
  }
)

app.get('/user',
  async (req,res) => {
    if(req.user){
      const entries = await readEntriesFromDB();
      res.send({isLoggedIn: true, entries});
    }else{
      res.send({isLoggedIn: false});
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

writeToDB = async (data) =>{
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const database = client.db('banking');
    const cardData = database.collection('cardData');
    const result = await cardData.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

readEntriesFromDB = async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const database = client.db('banking');
    const cardData = database.collection('cardData');
    let result = await cardData.find().toArray();
    if(result.length === 0){
      result = [
        {
          bank: "-",
          cardnum: "-"
        }
      ]
    }
    return result;
  } finally {
    await client.close();
  }
}