const   express           = require("express"),
        mongoose          = require("mongoose"),
        bodyParser        = require("body-parser"),
        cookieSession     = require("cookie-session"),
        passport          = require("passport");  

const keys = require("./config/keys"); // requiring keys
const passportSetup = require("./config/passport-setup"); //requiring passport config
const authRoutes = require("./routes/auth"); // requiring auth routes
const profileRoutes = require("./routes/profile");
const Thought = require("./models/thought"); // requiring Thought model

//Initialize express app
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));
//initialize passport 
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes); // setup auth routes
app.use("/profile", profileRoutes); // setup profile routes

mongoose.connect('mongodb://localhost/thoughtApp'); // connectiong database

app.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Thought.find({$or: [{thought: regex}, {author: regex}]}, (err, thoughts) => {
            if (err) {
                console.log(err);
            } else {
                res.render("index", {thoughts: thoughts, user: req.user});
            }
        }).sort( { _id:-1 } );   
    } else {
        Thought.find({}, (err, thoughts) => {
            if (err) {
                console.log(err);
            } else {
                res.render("index", {thoughts: thoughts, user: req.user});
            }
        }).sort( { _id:-1 } );  
    }
});

app.post("/", (req, res) => {
    Thought.create({

        author: req.user.username,
        thought: req.body.thought

    }), (err) => {
        if (err) {
            console.log(err)
        }
    }
    res.redirect("/");
});

app.get("/new", (req, res) => {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
    res.render("new", {user: req.user});
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started.")
});
