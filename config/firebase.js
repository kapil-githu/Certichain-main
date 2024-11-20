// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiKbz4TkoHe80ZiNiQeLq2icTGX6byYsM",
  authDomain: "certichain-4d8d8.firebaseapp.com",
  databaseURL: "https://certichain-4d8d8-default-rtdb.firebaseio.com",
  projectId: "certichain-4d8d8",
  storageBucket: "certichain-4d8d8.firebasestorage.app",
  messagingSenderId: "164788382270",
  appId: "1:164788382270:web:b56e3b1205c526679b3f6f",
  measurementId: "G-ZEQEN53VQ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { app, auth };
