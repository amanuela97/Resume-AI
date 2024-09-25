// firebase.ts (or firebase.js)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analyses, Analysis, CoverLetter, FireBaseDate } from "./types";

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
  if (!analysis.id) {
    console.error("analysis ID is undefined");
    return;
  }
  try {
    const analysisRef = doc(db, "analyses", analysis.id);
    await setDoc(analysisRef, {
      ...analysis,
      updatedAt: serverTimestamp(),
      createdAt: analysis.createdAt || serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
};

export const fetchAnalyses = async (user: User): Promise<Analyses> => {
  try {
    const q = query(
      collection(db, "analyses"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      ...formatFireStoreDate(doc),
    })) as Analyses;
  } catch (error) {
    console.error("Error fetching analyses", error);
    throw error;
  }
};

export const fetchAnalysis = async (id: string): Promise<Analysis | null> => {
  try {
    const docRef = doc(db, "analyses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        ...formatFireStoreDate(docSnap),
      } as Analysis;
    } else {
      console.error(`Analysis with id ${id} was not found!`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching analysis", error);
    throw error;
  }
};

export const saveCoverLetterToFirestore = async (coverLetter: CoverLetter) => {
  try {
    const coverLetterRef = doc(db, "coverLetters", coverLetter.id);
    await setDoc(coverLetterRef, {
      ...coverLetter,
      updatedAt: serverTimestamp(),
      createdAt: coverLetter.createdAt || serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    throw error;
  }
};

export const fetchCoverLettersFromFirestore = async (
  userId: string
): Promise<CoverLetter[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "coverLetters"), where("userId", "==", userId))
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      ...formatFireStoreDate(doc),
    })) as CoverLetter[];
  } catch (error) {
    console.error("Error fetching cover letters", error);
    throw error;
  }
};

export const fetchCoverLetter = async (
  id: string
): Promise<CoverLetter | null> => {
  try {
    const docRef = doc(db, "coverLetters", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        ...formatFireStoreDate(docSnap),
      } as CoverLetter;
    } else {
      console.error(`coverLetter with id ${id} was not found!`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coverLetter", error);
    throw error;
  }
};

export const formatFireStoreDate = (
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>
): { createdAt: FireBaseDate; updatedAt: FireBaseDate } => {
  return {
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt,
  };
};
