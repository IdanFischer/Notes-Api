import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { serviceAccount } from "../secrets.js";


export default async function dbConnect() {
  // check if app has already been initialized
  const isInitalized = getApps().length > 0
  if (!isInitalized) { // not initalized, connect to firebase
    initializeApp({
      credential: cert(serviceAccount)
    })
  }
  return getFirestore()
}
