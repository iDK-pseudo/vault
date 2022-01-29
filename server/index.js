const express = require("express");
const { body, check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const path = require("path");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster.kxtke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true`;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


passport.use(new LocalStrategy(verify = async (username, password, cb) => {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const database = client.db('banking');
      const userdata = database.collection('userdata');
      const result = await userdata.findOne({username: username});
      crypto.pbkdf2(password, 'salt', 310000, 32, 'sha256', (err, hashedPassword) => {
        if(!result) return cb(null, false, { message: 'Incorrect username or password.' });
        const bufferedPass = Buffer.from(result.password.data);
        if (Buffer.isBuffer(bufferedPass) && !crypto.timingSafeEqual(bufferedPass, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }else{
          return cb(null, username);
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
        res.send({success:true});
      }else{
        res.send({success:false, ...options});
      }
    })(req,res,next);
  }
);

app.post('/signup',
  check('username').isLength({min: 0}).trim().escape(),
  check('password').isLength({min: 0}).trim().escape(),
  async (req,res) => {
    const errorsResult = validationResult(req);
    if(errorsResult.isEmpty()){
      crypto.pbkdf2Sync(req.body.password, 'salt', 310000, 32, 'sha256', async (err, hashedPassword) => {
        const client = new MongoClient(MONGODB_URI);
        try {
          await client.connect();
          const database = client.db('banking');
          const userdata = database.collection('userdata');
          const result = await userdata.insertOne({_id: req.body.username, username: req.body.username, password: hashedPassword.toJSON()});
          console.log(`A user was inserted with the _id: ${result.insertedId}`);
        } finally {
          await client.close();
          res.send("success");
        }
      });
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