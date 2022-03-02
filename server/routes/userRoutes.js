const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const isAuth = require("../utils/authMiddleware").isAuth;
const passport = require("passport");

router.post(
    "/login",
    check("username").isEmail().normalizeEmail().trim().escape(),
    check("password").trim().escape(),
    userController.login
);

router.post(
    "/locked_login",
    check("username").isEmail().normalizeEmail().trim().escape(),
    check("password").trim().escape(),
    check("pin")
        .isNumeric({ no_symbols: true })
        .isLength({ min: 6, max: 6 })
        .trim()
        .escape(),
    userController.lockedlogin
);

router.post(
    "/signup",
    check("email").isEmail().normalizeEmail().trim().escape(),
    check("password").isStrongPassword().trim().escape(),
    check("pin")
        .isNumeric({ no_symbols: true })
        .isLength({ min: 6, max: 6 })
        .trim()
        .escape(),
    userController.signup
);

router.post("/logout", isAuth, userController.logout);

router.post(
    "/verify_pin",
    isAuth,
    check("pin")
        .isNumeric({ no_symbols: true })
        .isLength({ min: 6, max: 6 })
        .trim()
        .escape(),
    userController.verify_pin
);

router.get("/verify", userController.verify);

router.get("/lock_user", isAuth, userController.lock_user);

router.post(
    "/resend_email",
    check("email").isEmail().normalizeEmail().trim().escape(),
    userController.resend_email
);

router.get("/auth/google", passport.authenticate("google"));

router.get("/auth/google/redirect", userController.authGoogleRedirect);

router.post(
    "/insert_pin",
    check("pin")
        .isNumeric({ no_symbols: true })
        .isLength({ min: 6, max: 6 })
        .trim()
        .escape(),
    userController.insertPin
);

module.exports = router;
