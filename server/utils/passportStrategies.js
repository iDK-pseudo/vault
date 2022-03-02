const LocalStrategy = require("passport-local");
const User = require("../models/user");
const crypto = require("crypto");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

exports.LocalStrategy = function () {
    return new LocalStrategy(
        { passReqToCallback: true },
        async (req, email, password, cb) => {
            let passwordValid = false,
                pinValid = false,
                redisSession = null;
            const foundUser = await User.findOne({ email: email });

            if (!foundUser)
                return cb(null, false, {
                    message: "Incorrect email or password.",
                });

            const hashedPassword = crypto.pbkdf2Sync(
                password,
                Buffer.from(foundUser.buf, "base64"),
                310000,
                32,
                "sha256"
            );
            if (
                crypto.timingSafeEqual(
                    Buffer.from(foundUser.password, "base64"),
                    hashedPassword
                )
            ) {
                passwordValid = true;
            }

            if (passwordValid && foundUser.locked) {
                if (!isNaN(req.body.pin)) {
                    const hashedPin = crypto.pbkdf2Sync(
                        req.body.pin,
                        Buffer.from(foundUser.buf, "base64"),
                        310000,
                        32,
                        "sha256"
                    );
                    if (
                        crypto.timingSafeEqual(
                            Buffer.from(foundUser.pin, "base64"),
                            hashedPin
                        )
                    ) {
                        pinValid = true;
                        await User.updateOne({ _id: email }, { locked: false });
                    } else {
                        pinValid = false;
                    }
                } else {
                    return cb(null, false, { message: "Account Locked" });
                }
            }

            if (!foundUser.verified) {
                redisSession = await RedisHelper.get(email);
                if (!isNaN(req.body.pin) && redisSession) {
                    if (req.body.pin == redisSession.code) {
                        await User.updateOne(
                            { _id: email },
                            { verified: true }
                        );
                        foundUser.verified = true;
                        await RedisHelper.del(email);
                    } else {
                        return cb(null, false, {
                            message: "Incorrect email code",
                        });
                    }
                }
            }

            if (
                (!foundUser.locked && passwordValid) ||
                (foundUser.locked && passwordValid && pinValid)
            ) {
                if (!foundUser.verified) {
                    if (
                        !redisSession ||
                        EmailHelper.isEmailRequired(redisSession)
                    ) {
                        const newVal = EmailHelper.sendEmail(
                            email,
                            redisSession
                        );
                        await RedisHelper.set(email, newVal);
                        return cb(null, false, {
                            message: "Email Unverified",
                            duration: newVal.duration,
                        });
                    } else {
                        return cb(null, false, {
                            message: "Email already sent",
                            emailTimestamp: redisSession.timestamp,
                            duration: redisSession.duration,
                            retries: redisSession.retries,
                        });
                    }
                }
                req.session[email] = { unlocked: pinValid };
                return cb(null, email);
            } else {
                return cb(null, false, { message: "Incorrect credentials" });
            }
        }
    );
};

exports.GoogleStrategy = function () {
    return new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, cb) => {
            const foundUser = await User.findOne({
                googleId: profile.id,
                fullName: profile.displayName,
            }).lean();
            if (foundUser) {
                return cb(null, {
                    user: foundUser.email,
                    restrict: !Boolean(foundUser.pin),
                });
            }
            const createdUser = await User.create({
                googleId: profile.id,
                fullName: profile.displayName,
                email: profile.emails[0].value,
            });
            return cb(null, { user: createdUser.email, restrict: true });
        }
    );
};
