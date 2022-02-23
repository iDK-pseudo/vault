const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const crypto = require('crypto');
const EmailHelper = require('./emailUtil');
const RedisHelper = require('./redisUtil.js');

module.exports = class PassportHelper {

    static initializePassport = async () => {
        passport.use(new LocalStrategy({ passReqToCallback: true }, async (req, email, password, cb) => {
          let passwordValid = false, pinValid= false,redisSession = null;
          const foundUser = await User.findOne({email: email});

          if(!foundUser) return cb(null, false, { message: 'Incorrect email or password.' });
          
          const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(foundUser.buf, "base64"), 310000, 32, 'sha256');
          if (crypto.timingSafeEqual( Buffer.from(foundUser.password, "base64"), hashedPassword)) {
            passwordValid = true;
          }

          if(passwordValid && foundUser.locked) {
            if(!isNaN(req.body.pin)){
              const hashedPin = crypto.pbkdf2Sync(req.body.pin, Buffer.from(foundUser.buf, "base64"), 310000, 32, 'sha256');
              if (crypto.timingSafeEqual(Buffer.from(foundUser.pin, "base64"), hashedPin)) {
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
            redisSession = await RedisHelper.get(email);
            if(!isNaN(req.body.pin) && redisSession){
              if(req.body.pin == redisSession.code){
                await User.updateOne({_id: email}, {verified: true});
                foundUser.verified = true;
                await RedisHelper.del(email);
              }else{
                return cb(null, false, {message: 'Incorrect email code'});
              }
            }
          }

          if((!foundUser.locked && passwordValid) || (foundUser.locked && passwordValid && pinValid)){
            if(!foundUser.verified) {
              if(!redisSession || EmailHelper.isEmailRequired(redisSession)){
                const newVal = EmailHelper.sendEmail(email, redisSession);
                await RedisHelper.set(email, newVal);
                return cb(null, false, {message: 'Email Unverified', duration: newVal.duration});
              }else{
                return cb(null, false, {
                  message: 'Email already sent',
                  emailTimestamp: redisSession.timestamp, 
                  duration: redisSession.duration,
                  retries: redisSession.retries
                });
              }
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

