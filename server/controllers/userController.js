const { validationResult } = require("express-validator");
const crypto = require("crypto");
const User = require("../models/user");
const passport = require("passport");

exports.login = function (req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        passport.authenticate("local", (err, user, options) => {
            if (user) {
                req.logIn(user, () => {});
                res.send({ success: true });
            } else {
                res.send({ success: false, ...options });
            }
        })(req);
    }
};

exports.lockedlogin = function (req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        passport.authenticate("local", (err, user, options) => {
            if (user) {
                req.logIn(user, () => {});
                res.send({ success: true });
            } else {
                res.send({ success: false, ...options });
            }
        })(req);
    }
};

exports.signup = async function (req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        const buf = crypto.randomBytes(32);
        const hashedPassword = crypto.pbkdf2Sync(
            req.body.password,
            buf,
            310000,
            32,
            "sha256"
        );
        const hashedPin = crypto.pbkdf2Sync(
            req.body.pin,
            buf,
            310000,
            32,
            "sha256"
        );
        try {
            const mongoRes = await User.create({
                _id: req.body.email,
                email: req.body.email,
                password: hashedPassword.toString("base64"),
                pin: hashedPin.toString("base64"),
                buf: buf.toString("base64"),
            });
            console.log(`A user was inserted with the _id: ${mongoRes._id}`);
            res.send({ success: true });
        } catch (ex) {
            if (ex.errmsg.includes("duplicate")) {
                res.send({
                    success: false,
                    errors: [
                        {
                            param: "duplicate-email",
                            msg: "User already exists",
                        },
                    ],
                });
            } else {
                res.send({
                    success: false,
                    errors: [{ param: "server-issue", msg: "Server issue" }],
                });
            }
        }
    } else {
        res.send({ success: false, ...errorsResult });
    }
};

exports.logout = function (req, res, next) {
    req.logout();
    res.clearCookie("connect.sid");
    req.session.destroy((err) => res.send({ loggedOut: true }));
};

exports.verify_pin = async function (req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        const foundUser = await User.findOne({ email: req.user });
        if (!foundUser) res.send({ success: false });
        const hashedPin = crypto.pbkdf2Sync(
            req.body.pin,
            Buffer.from(foundUser.buf, "base64"),
            310000,
            32,
            "sha256"
        );
        if (
            !crypto.timingSafeEqual(
                Buffer.from(foundUser.pin, "base64"),
                hashedPin
            )
        ) {
            res.send({ success: false });
        } else {
            req.session[req.user] = { unlocked: true };
            res.send({ success: true });
        }
    } else {
        res.send({ success: false });
    }
};

exports.verify = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.send({ isLoggedIn: true });
    } else {
        res.send({ isLoggedIn: false });
    }
};

exports.lock_user = async function (req, res, next) {
    const mongoRes = await User.updateOne(
        { email: req.user },
        { locked: true }
    );
    if (mongoRes.modifiedCount > 0) {
        req.logout();
        res.clearCookie("connect.sid");
        req.session.destroy((err) => res.send({ success: true }));
    } else {
        res.send({ success: false });
    }
};

exports.resend_email = async function (req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        const foundUser = await User.findById(req.body.email);
        if (foundUser) {
            const redisSession = await RedisHelper.get(req.body.email);
            if (redisSession) {
                if (EmailHelper.isEmailRequired(redisSession)) {
                    const newVal = EmailHelper.sendEmail(
                        req.body.email,
                        redisSession
                    );
                    await RedisHelper.set(req.body.email, newVal);
                    res.send({ success: true, duration: newVal.duration });
                } else if (Number.parseInt(redisSession.retries) === 2) {
                    res.send({ success: false, msg: "Resend Limit reached" });
                }
            }
        } else {
            res.status(400).send({
                success: false,
                msg: "User does not exist",
            });
        }
    } else {
        res.send({ success: false });
    }
};

exports.authGoogleRedirect = function (req, res, next) {
    passport.authenticate("google", function (err, info, options) {
        if (info) {
            req.logIn(info.user, (err) => {});
            req.session.passport.restrict = info.restrict;
        }
        res.redirect("/");
    })(req, res);
};
