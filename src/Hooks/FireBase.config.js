// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL66ckuzWyyit1uZMaX8Uyt7CF8-68S50",
  authDomain: "thg10-306c5.firebaseapp.com",
  projectId: "thg10-306c5",
  storageBucket: "thg10-306c5.appspot.com",
  messagingSenderId: "548064634645",
  appId: "1:548064634645:web:046badcf2820340585ab1c",
  measurementId: "G-3QW3TPM58S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);