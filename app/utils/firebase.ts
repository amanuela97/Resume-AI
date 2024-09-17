// firebase.ts (or firebase.js)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analysis } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const storeUserData = async (user: User) => {
  const {
    displayName,
    email,
    emailVerified,
    photoURL,
    uid,
    providerId,
    metadata,
  } = user;
  const { creationTime, lastSignInTime } = metadata;

  const userData = {
    displayName,
    email,
    emailVerified,
    photoURL,
    uid,
    providerId,
    creationTime,
    lastSignInTime,
    phoneNumber: user.phoneNumber || null,
  };

  try {
    await setDoc(doc(db, "users", uid), userData);
    // Store user data in local storage
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

export const saveAnalysisToFirestore = async (analysis: Analysis) => {
  const db = getFirestore();
  const analysisRef = doc(db, "analyses", analysis.id);
  try {
    await setDoc(analysisRef, analysis);
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
};
