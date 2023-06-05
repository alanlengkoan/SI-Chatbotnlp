const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotEnv = require('dotenv');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

dotEnv.config({
    path: './.env',
});

const app = express();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// google auth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SCOPE = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/dialogflow',
    'profile', 
    'email'
];

var userProfile;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    userProfile=profile;
    userProfile.accessToken = accessToken;
    return done(null, userProfile);
  }
));

// untuk home
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// untuk success
app.get('/auth/google/success', (req, res) => {
    res.send("Berhasil login dengan akun google milik " + JSON.stringify(userProfile));
});

// untuk failure
app.get('/auth/google/failure', (req, res) => {
    res.send('Login gagal');
});

app.get('/auth/google', passport.authenticate('google', { scope : SCOPE}));
 
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));

// untuk host
const port = process.env.PORT || 3000;
const host = "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Server sedang berjalan pada http://${host}:${port}`);
});