import express from "express";
import session from "express-session";
import dotEnv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from "firebase/firestore";

dotEnv.config({
    path: './.env',
});

const app = express();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// initialize firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDwkPfOglLaGzGCo-OBFp7r63nxfX-zkRA",
//   authDomain: "chatbot-dialogflow-api.firebaseapp.com",
//   projectId: "chatbot-dialogflow-api",
//   storageBucket: "chatbot-dialogflow-api.appspot.com",
//   messagingSenderId: "57495981958",
//   appId: "1:57495981958:web:07c0459739ef7bc8aa6607",
//   measurementId: "G-D2HW0WTDVB"
// };
// const appFirebase = initializeApp(firebaseConfig);
// const db = getFirestore(appFirebase);

// initialize google auth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
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
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    userProfile=profile;
    userProfile.accessToken = accessToken;
    userProfile.refreshToken = refreshToken;
    return done(null, userProfile);
  }
));

// untuk host
const port = process.env.PORT;
const host = "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Server sedang berjalan pada http://${host}:${port}`);
});

// untuk home
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// begin:: firebase
app.post('/create', async (req, res) => {
  const data = req.body;
  res.send(data);
});
// end:: firebase

// begin:: google auth
// untuk success
app.get('/auth/google/success', (req, res) => {
    res.send("Berhasil login dengan akun google milik " + JSON.stringify(userProfile));
});

// untuk failure
app.get('/auth/google/failure', (req, res) => {
    res.send('Login gagal');
});

// untuk login
app.get('/auth/google', passport.authenticate('google', { scope : SCOPE}));
 
// untuk callback
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));
// end:: google auth