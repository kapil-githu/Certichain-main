// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuuBlyMfytJrBifPKSA_0tDQCgzS3arfk",
  authDomain: "certichain-a2433.firebaseapp.com",
  databaseURL: "https://certichain-a2433-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "certichain-a2433",
  storageBucket: "certichain-a2433.appspot.com",
  messagingSenderId: "350012818334",
  appId: "1:350012818334:web:4fbb5a0956bd329c8d0c8f",
  measurementId: "G-TYWRYWVDTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { app, auth };
