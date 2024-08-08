import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// You should replace these with your own Firebase config values
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1",
  databaseURL: process.env.DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Realtime Database
export const db = getFirestore(app);
export const databa2e = getDatabase(app);

// Initialize Auth
export const auth = getAuth(app);

console.log("app", app.name);

// Get server timestamp (if needed)
import { serverTimestamp } from "firebase/firestore";
export const timeStamp = serverTimestamp;