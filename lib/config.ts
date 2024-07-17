import admin from "firebase-admin";

import serviceAccount from "../creds/door-lock-9d58f-firebase-adminsdk-gx99j-57f78f7c11.json"

export const {
  API_KEY,
  PROJECT_ID,
  DATABASE_URL
} = process.env;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: DATABASE_URL,
  });
}

export const db = admin.firestore();

export const databa2e = admin.database();

export const auth = admin.auth();

export const timeStamp = admin.firestore.FieldValue.serverTimestamp;
