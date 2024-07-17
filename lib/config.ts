import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const {
  API_KEY,
  PROJECT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: API_KEY,
  projectId: PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app);




