const router = require("express").Router();

const authCheck = function (req, res, next) {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        next();
    }
};

router.get("/", authCheck, (req, res) => {
    res.render("profile", {username: req.user.username, user: req.user});
});

module.exports = router;