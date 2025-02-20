import admin from "firebase-admin";
import dotenv from "dotenv";

admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_CREDENTIALS),
});

export { admin };
