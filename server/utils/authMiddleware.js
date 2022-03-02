module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated() && !req.session.passport.restrict) {
        next();
    } else {
        res.status(401).send("You are not authorized to view this resource");
    }
};
