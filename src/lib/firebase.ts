// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUhOLuVBtHhhFglEYTDyp7GIIs5W2VA-Q",
  authDomain: "kanteen-mrc-blr-24cfa.firebaseapp.com",
  projectId: "kanteen-mrc-blr-24cfa",
  storageBucket: "kanteen-mrc-blr-24cfa.firebasestorage.app",
  messagingSenderId: "1054581883069",
  appId: "1:1054581883069:web:44dc089a179f47f17637d4",
  measurementId: "G-NM1NM2DTTL"
};



/*
const firebaseConfig = {
  apiKey: "AIzaSyCUhOLuVBtHhhFglEYTDyp7GIIs5W2VA-Q",
  authDomain: "kanteen-mrc-blr-24cfa.firebaseapp.com",
  projectId: "kanteen-mrc-blr-24cfa",
  storageBucket: "kanteen-mrc-blr-24cfa.firebasestorage.app",
  messagingSenderId: "1054581883069",
  appId: "1:1054581883069:web:44dc089a179f47f17637d4",
  measurementId: "G-NM1NM2DTTL"
};

*/
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);


export { app, db, auth };
