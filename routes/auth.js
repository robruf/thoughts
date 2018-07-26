const router = require("express").Router();
const passport = require("passport");

const authCheck = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect("/");
    }
};
//login
router.get("/login", authCheck, (req, res) => {
    res.render("login", {user: req.user});
});

// logout
router.get("/logout", (req, res) => {
    //handle with passport
    req.logout();
    res.redirect("/");
});

//register
router.get("/signup", authCheck, (req, res) => {
    res.render("signup", {user: req.user});
});
// google auth

router.get("/google", authCheck, passport.authenticate("google", {
    scope: ["profile"]
})) 
    //goes to google consent screen

    // callback for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/profile");
});

module.exports = router;

