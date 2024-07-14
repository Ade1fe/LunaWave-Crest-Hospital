

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {createUserWithEmailAndPassword } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRjA7UkNsfhn5rGqoqo71TixJ4CwrqSAo",
  authDomain: "lunawave-crest-hospital.firebaseapp.com",
  projectId: "lunawave-crest-hospital",
  storageBucket: "lunawave-crest-hospital.appspot.com",
  messagingSenderId: "5931628297",
  appId: "1:5931628297:web:9fd931144424f6bbf1c5d8"
};

  

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
const firestore = getFirestore(app);
const storage = getStorage(app);
const db = getFirestore(app);


onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log('User is logged in:', user.uid);
  } else {
    // console.log('User is logged out');
  }
});

export { app, analytics, auth, firestore, storage, getAuth, db, onAuthStateChanged , createUserWithEmailAndPassword};