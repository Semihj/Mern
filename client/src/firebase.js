// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "clone-35f24.firebaseapp.com",
  projectId: "clone-35f24",
  storageBucket: "clone-35f24.appspot.com",
  messagingSenderId: "877740661096",
  appId: "1:877740661096:web:b7528a54f3fc91d86f5edd",
  measurementId: "G-SE1X52D1HK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
