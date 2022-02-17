const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const crypto = require('crypto');
const EmailHelper = require('./emailUtil');

module.exports = class PassportHelper {

    static initializePassport = async () => {
        passport.use(new LocalStrategy({ passReqToCallback: true }, async (req, email, password, cb) => {
          let passwordValid = false, pinValid= false;
          const foundUser = await User.findOne({email: email});
          
          if(!foundUser) return cb(null, false, { message: 'Incorrect email or password.' });
          
          const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(foundUser.buf), 310000, 32, 'sha256');
          if (crypto.timingSafeEqual( Buffer.from(foundUser.password), hashedPassword)) {
            passwordValid = true;
          }

          if(foundUser.locked) {
            if(!isNaN(req.body.pin)){
              const hashedPin = crypto.pbkdf2Sync(req.body.pin, Buffer.from(foundUser.buf), 310000, 32, 'sha256');
              if (crypto.timingSafeEqual(Buffer.from(foundUser.pin), hashedPin)) {
                pinValid = true;
                await User.updateOne({_id: email}, {locked: false});
              }else{
                pinValid = false;
              }
            }else{
              return cb(null, false, {message: 'Account Locked'});
            }
          }

          if(!foundUser.verified){
            if(!isNaN(req.body.pin) && req.session.emailCode){
              if(req.body.pin == req.session.emailCode){
                await User.updateOne({_id: email}, {verified: true});
                foundUser.verified = true;
                delete req.session.emailCode;
              }else{
                return cb(null, false, {message: 'Incorrect email code'});
              }
            }
          }

          if((!foundUser.locked && passwordValid) || (foundUser.locked && passwordValid && pinValid)){
            if(!foundUser.verified) {
              const emailCode = Math.floor(100000 + Math.random() * 900000);
              req.session.emailCode = emailCode;
              EmailHelper.sendEmail(email, emailCode);
              return cb(null, false, {message: 'Email Unverified'});
            }
            return cb(null, email);
          }else{
            return cb(null, false, {message: 'Incorrect credentials'});
          }
        }));
    
        passport.serializeUser(function(user, done) {
            done(null, user);
          });
          
        passport.deserializeUser(function(user, done) {
            done(null, user);
        });
    }
    
    static passportAuthenticate = (req, res, next) => {
        passport.authenticate('local', (err, user, options)=>{
            if(user){
              req.logIn(user, (err)=>{});
              res.send({success:true});
            }else{
              res.send({success:false, ...options});
            }
        })(req, res, next);
    }
}

