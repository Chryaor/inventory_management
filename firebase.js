
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2mE1Akj6Yi5MXuPuNpvCbe5aGEFsaZpA",
  authDomain: "inventory-management-8bc27.firebaseapp.com",
  projectId: "inventory-management-8bc27",
  storageBucket: "inventory-management-8bc27.appspot.com",
  messagingSenderId: "756401174078",
  appId: "1:756401174078:web:3fc7689cefcc90462ec36f",
  measurementId: "G-SPERTCE4KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}