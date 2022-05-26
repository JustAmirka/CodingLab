var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("./models/user");
const ejs=require('ejs');
const app = express();
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))


app.use("/", require("./home"));


app.use("/about", require("./about"));
app.use("/subscrible", require("./subscrible"));

app.use("/HowIW", require("./HowIW"));
app.use("/features", require("./features"));

const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
    res.render("index");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Showing register form
app.get("/index", function (req, res) {
    res.render("index");
});

// Handling user signup
app.post("/index", function (req, res) {
    var username = req.body.username
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email
    var password = req.body.password
    User.register(new User({ email: email, firstName: firstName, lastName: lastName, username: username  }),
        password, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("index");
            }

            passport.authenticate("local")(
                req, res, function () {
                    res.render("secret");
                });
        });
});

//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
});

/*app.get('/secret', function(req, res) {
    MongoClient.connect(dbConfig, { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.error(err);
        const db = client.db('GoFood');
        const collection = db.collection('users');
        collection
            .find()
            .toArray()
            .then((results) => {
                res.render('secret.ejs', { users: results });
            })
            .catch((error) => {
                res.redirect('/');
            });
    });
})*/

//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

var port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`)});