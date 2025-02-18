import admin from "firebase-admin";
import serviceAccount from "../config/hirehub-ea9b7-firebase-adminsdk-fbsvc-04f1327448.json" assert { type: "json" }; // Update the path to match the actual location
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };
