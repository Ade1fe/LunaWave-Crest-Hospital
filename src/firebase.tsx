

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkCIvu7puKTKNYNENjbd5pxwR6veD5KNg",
  authDomain: "cut2fit-8d358.firebaseapp.com",
  projectId: "cut2fit-8d358",
  storageBucket: "cut2fit-8d358.appspot.com",
  messagingSenderId: "768164009915",
  appId: "1:768164009915:web:ee5fee020d357ec3ae569e"
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

export { app, analytics, auth, firestore, storage, getAuth, db, onAuthStateChanged };