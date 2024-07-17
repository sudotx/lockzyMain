import admin from "firebase-admin";

import serviceAccount from "../creds/door-lock-9d58f-firebase-adminsdk-gx99j-57f78f7c11.json"

export const {
  API_KEY,
  PROJECT_ID,
} = process.env;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  });
}

export const db = admin.firestore();