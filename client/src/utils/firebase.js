// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskflow-33ce6.firebaseapp.com",
  projectId: "taskflow-33ce6",
  storageBucket: "taskflow-33ce6.appspot.com",
  messagingSenderId: "314827269404",
  appId: "1:314827269404:web:a08ff359e690da36aec6d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);