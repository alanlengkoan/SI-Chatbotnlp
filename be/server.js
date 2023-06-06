import express, { text } from "express";
import session from "express-session";
import dotEnv from "dotenv";
import passport from "passport";
import {
  Strategy as GoogleStrategy
} from "passport-google-oauth2";
import {
  initializeApp
} from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import dialogflow from "dialogflow";

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
app.use(express.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwkPfOglLaGzGCo-OBFp7r63nxfX-zkRA",
  authDomain: "chatbot-dialogflow-api.firebaseapp.com",
  projectId: "chatbot-dialogflow-api",
  storageBucket: "chatbot-dialogflow-api.appspot.com",
  messagingSenderId: "57495981958",
  appId: "1:57495981958:web:07c0459739ef7bc8aa6607",
  measurementId: "G-D2HW0WTDVB"
};
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

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
  function (request, accessToken, refreshToken, profile, done) {
    userProfile = profile;
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
// untuk create
app.post('/firebase/create', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await addDoc(collection(db, "Users"), data);
    res.send('Create data berhasil ' + docRef.id);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// untuk read
app.get('/firebase/read', async (req, res) => {
  try {
    const users = collection(db, 'Users');
    const usersSnapshot = await getDocs(users);
    const usersList = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    res.send(usersList);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// untuk read by
app.get('/firebase/read/:any', async (req, res) => {
  try {
    const users = collection(db, 'Users');
    const usersSnapshot = await getDocs(users);
    const usersList = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const user = usersList.find(user => user.email === req.params.any);
    if (user == null) {
      return res.send('User tidak ditemukan');
    } else {
      return res.send(user);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// untuk update
app.put('/firebase/update/:any', async (req, res) => {
  try {
    const users = collection(db, 'Users');
    const usersSnapshot = await getDocs(users);
    const usersList = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const user = usersList.find(user => user.email === req.params.any);
    if (user == null) {
      return res.send('User tidak ditemukan');
    } else {
      const data = req.body;
      await updateDoc(doc(db, "Users", user.id), data);
      res.send('Update data berhasil ' + user.id);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// untuk delete
app.delete('/firebase/delete/:any', async (req, res) => {
  try {
    const users = collection(db, 'Users');
    const usersSnapshot = await getDocs(users);
    const usersList = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const user = usersList.find(user => user.email === req.params.any);
    if (user == null) {
      return res.send('User tidak ditemukan');
    } else {
      await deleteDoc(doc(db, "Users", user.id));
      res.send('Delete data berhasil ' + user.id);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// end:: firebase

// begin:: dialogflow
// untuk detect intent
app.post('/dialogflow/detect', async (req, res) => {
  try {
    const data = req.body;
    
    const credentials = JSON.parse(process.env.DIALOGFLOW_CREDENTIALS);
    const projectId = credentials.project_id;
    const sessionId = 'Testing';
    const languageCode = 'id-ID';

    const config = {
      credentials: {
        private_key: credentials.private_key,
        client_email: credentials.client_email,
      }
    };

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: data.query,
          languageCode: languageCode,
        },
      },
    };

    await sessionClient.detectIntent(request);
    await addDoc(collection(db, "Chats"), data);

    res.status(200).send({
      message: "Berhasil",
      text: "Berhasil menambahkan chat ke firebase"
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// untuk webhook
app.post('/dialogflow/webhook', async (req, res) => {
  try {
    const data = req.body;
    const result = data.queryResult;

    const post = {
      id_account: "-",
      type: "bot",
      query: result.queryText,
      message: result.fulfillmentText,
    };

    await addDoc(collection(db, "Chats"), post);

    res.status(200).send({
      message: "Berhasil",
      text: "Berhasil menambahkan chat ke firebase"
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// end:: dialogflow

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
app.get('/auth/google', passport.authenticate('google', {
  scope: SCOPE
}));

// untuk callback
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));
// end:: google auth