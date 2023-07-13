import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDwkPfOglLaGzGCo-OBFp7r63nxfX-zkRA",
  authDomain: "chatbot-dialogflow-api.firebaseapp.com",
  projectId: "chatbot-dialogflow-api",
  storageBucket: "chatbot-dialogflow-api.appspot.com",
  messagingSenderId: "57495981958",
  appId: "1:57495981958:web:07c0459739ef7bc8aa6607",
  measurementId: "G-D2HW0WTDVB"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;