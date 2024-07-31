const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
//import connection
require("./connection");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");


const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;

//fill the require data
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const utilRouter = require('./routers/util');
const commentRouter = require('./routers/commentRouter');

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

//that is port to start express server
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/util', utilRouter);
app.use('/comment', commentRouter);

app.use(express.static('./static/uploads'));

const PORT = 5000;


// Setup session
app.use(session({
    secret: "fuckoff",
    resave: false,
    saveUninitialized: true
}));

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ["profile", "email"]
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userdb.findOne({ googleId: profile.id });

            if (!user) {
                user = new userdb({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });

                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initial Google OAuth login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/Login"
}));

app.get("/login/success", async (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "User logged in", user: req.user });
    } else {
        res.status(400).json({ message: "Not Authorized" });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("http://localhost:3000");
    });
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});