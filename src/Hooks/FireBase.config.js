// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM_jSR9IuoxYmqxB_hZwney42yopPo-Iw",
  authDomain: "houseforrent-ada42.firebaseapp.com",
  projectId: "houseforrent-ada42",
  storageBucket: "houseforrent-ada42.appspot.com",
  messagingSenderId: "186425026315",
  appId: "1:186425026315:web:3cd929e2ca1f67cb17a40e",
  measurementId: "G-CXTQ0PZFGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);