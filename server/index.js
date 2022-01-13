const express = require("express");
const { body, check, validationResult } = require('express-validator');
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post("/api", 
  body('bank','Bank must be non-empty, contain only Alphabets, Numbers and 5+ chars long').isAlphanumeric('en-US',{ignore: ' '}).isLength({min: 5}).trim(),
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
  
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

writeToDB = async (data) =>{
  const uri = "mongodb+srv://shivam:shivam1999@firstcluster.kxtke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
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