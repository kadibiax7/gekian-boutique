import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/** Initialize on demand so Next.js can build without browser env configuration. */
export function getClientDb(): Firestore {
 const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 };
 if (!config.apiKey || !config.projectId || !config.appId) {
  throw new Error("Missing Firebase web app configuration. Set NEXT_PUBLIC_FIREBASE_* environment variables.");
 }
 const app: FirebaseApp = getApps()[0] ?? initializeApp(config);
 return getFirestore(app);
}
