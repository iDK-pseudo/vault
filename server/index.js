const express = require("express");
const { body, check, validationResult } = require('express-validator');
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const path = require("path");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster.kxtke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true`;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
    const result = await cardData.find().toArray();
    return result;
  } finally {
    await client.close();
  }
}