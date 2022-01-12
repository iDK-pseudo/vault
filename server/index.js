const express = require("express");
const path = require('path');
const { body, check, validationResult } = require('express-validator');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
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
      console.log(payload);
      res.send(payload);
    }
  }
);
  

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});