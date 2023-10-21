// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw5sszfQiohfwGD1IJmFNr5MvlAL1jqMo",
  authDomain: "testotp-343af.firebaseapp.com",
  projectId: "testotp-343af",
  storageBucket: "testotp-343af.appspot.com",
  messagingSenderId: "750120698792",
  appId: "1:750120698792:web:894246fc51c74d0ab2d39d",
  measurementId: "G-88TD82E3KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);