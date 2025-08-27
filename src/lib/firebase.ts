// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfEL-nZQsRR72PmX1npnP3GrrFeT4SQDI",
  authDomain: "kanteen-as.firebaseapp.com",
  projectId: "kanteen-as",
  storageBucket: "kanteen-as.appspot.com",
  messagingSenderId: "1013880615923",
  appId: "1:1013880615923:web:db75dcc21bf8dc71f11886",
  measurementId: "G-GGP9E9CH6M"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);


export { app, db, auth };
