// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase configuration
// This is the object you copied from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDNLb5blvaPsfoJLwKJ_4wZ5R7XyG779SU",
  authDomain: "campus-companion-d7f25.firebaseapp.com",
  projectId: "campus-companion-d7f25",
  storageBucket: "campus-companion-d7f25.firebasestorage.app",
  messagingSenderId: "179918493070",
  appId: "1:179918493070:web:1ecc1ed9684bb3766200df",
  measurementId: "G-M7W81STN7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services we need
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);