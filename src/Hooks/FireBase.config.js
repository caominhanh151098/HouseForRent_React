// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6HAmmlT9Eiw9FsNdw1QSzZFTIc8zqatc",
  authDomain: "houseforrent-bbf46.firebaseapp.com",
  projectId: "houseforrent-bbf46",
  storageBucket: "houseforrent-bbf46.appspot.com",
  messagingSenderId: "66212608652",
  appId: "1:66212608652:web:c1d4dacd9f12c90d46d9a9",
  measurementId: "G-N8HY8X3PD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);