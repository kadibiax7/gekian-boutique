import "server-only";
import {applicationDefault, getApps, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
export function getAdminDb() {
  const app = getApps().find(v => v.name === "gekian-checkout") ?? initializeApp({credential:applicationDefault(), projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}, "gekian-checkout");
  return getFirestore(app);
}
