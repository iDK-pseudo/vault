const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cardRoutes = require("./routes/cardRoutes");
const PassportStrategy = require("./utils/passportStrategies");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster-shard-00-00.kxtke.mongodb.net:27017,firstcluster-shard-00-01.kxtke.mongodb.net:27017,firstcluster-shard-00-02.kxtke.mongodb.net:27017/banking?ssl=true&replicaSet=atlas-9qr6zu-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI);

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGODB_URI }),
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// RedisHelper.initialize();

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(PassportStrategy.LocalStrategy());
passport.use(PassportStrategy.GoogleStrategy());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

//User routes
app.use("/", userRoutes);

//Card routes
app.use("/", cardRoutes);

app.use(express.static(path.join(__dirname, "../build/")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
