// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhkdJU_gMUfM7luAylPg0Bj8o18mV8W1U",
  authDomain: "react-01-58ddf.firebaseapp.com",
  projectId: "react-01-58ddf",
  storageBucket: "react-01-58ddf.firebasestorage.app",
  messagingSenderId: "519619887172",
  appId: "1:519619887172:web:bf70800feaf41605fc7c11",
  measurementId: "G-XFLBXKM2JQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
