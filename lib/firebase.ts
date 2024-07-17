// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


export const {
    API_KEY,
    PROJECT_ID,
    STORAGE_BUCKET,
    APP_ID,
} = process.env;


const firebaseConfig = {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    appId: APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)