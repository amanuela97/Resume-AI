// firebase.ts (or firebase.js)
import { getApps, initializeApp } from "firebase/app";
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
  addDoc,
  updateDoc,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import {
  Analyses,
  Analysis,
  CoverLetter,
  CustomUser,
  FireBaseDate,
  Reply,
  Review,
  Subscription,
  TemplateMetada,
  uploadTemplateProp,
} from "./types";
import { isAdmin } from "./helper";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

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
export const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

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

export const signOut = async () => await auth.signOut();

export const storeUserData = async (user: User): Promise<CustomUser> => {
  if (!user) {
    throw new Error("user is required");
  }

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
    role: isAdmin(email) ? "admin" : "user",
  };

  try {
    await setDoc(doc(db, "users", uid), userData, { merge: true });
    return userData;
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

export const fetchAnalyses = async (user: CustomUser): Promise<Analyses> => {
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

export const uploadTemplate = async ({
  name,
  previewImage,
  colorsArray,
  docxFile,
  isPremium,
}: uploadTemplateProp) => {
  const storage = getStorage();
  const db = getFirestore();

  try {
    const id = uuidv4();
    // Upload the .docx file to Firebase Storage
    const docxFileRef = ref(storage, `templates/${name}-${id}.docx`);
    const docxSnapshot = await uploadBytes(docxFileRef, docxFile);
    const docxFileURL = await getDownloadURL(docxSnapshot.ref);

    // Upload the preview image to Firebase Storage
    const imageFileRef = ref(storage, `templates/${name}-preview-${id}.png`);
    const imageSnapshot = await uploadBytes(imageFileRef, previewImage);
    const previewImageURL = await getDownloadURL(imageSnapshot.ref);

    // Store the metadata in Firestore
    await addDoc(collection(db, "templateMetadata"), {
      name,
      docxFileURL,
      previewImageURL,
      colors: colorsArray,
      isPremium,
    });
    console.log("File uploaded and metadata saved successfully.");
    toast.success("Template uploaded successfully.");
  } catch (error) {
    console.log("Error uploading file and saving metadata:", error);
    throw error;
  }
};

export const fetchTemplateMetadata = async (): Promise<TemplateMetada[]> => {
  try {
    const templateCollection = collection(db, "templateMetadata");
    const templateSnapshot = await getDocs(templateCollection);

    const templateList = templateSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TemplateMetada[];
    return templateList;
  } catch (error) {
    console.error("Error fetching cover letters", error);
    throw error;
  }
};

export const uploadImageToFirebase = async ({
  uid,
  imageUrl,
  templateName,
}: {
  uid: string;
  imageUrl: string;
  templateName: string;
}): Promise<string | null> => {
  const storageRef = ref(storage, `resumeImages/${uid}/${templateName}.png`);

  try {
    // Upload the base64 image string to Firebase
    await uploadString(storageRef, imageUrl, "data_url");

    // Get the download URL
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const fetchReviews = async (): Promise<Review[] | null> => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const reviewSnapshot = await getDocs(reviewsCollection);
    const reviewList = reviewSnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as Review[];
    return reviewList;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
};

export const addReview = async (review: Review): Promise<Review | null> => {
  try {
    const newReviewData = {
      ...review,
      replies: [],
    };
    const reviewDoc = doc(db, "reviews", review.id);
    await setDoc(reviewDoc, newReviewData);
    toast.success("added review successfully");
    return newReviewData;
  } catch (error) {
    console.error("Error adding review:", error);
    return null;
  }
};

export const addReply = async (
  review: Review,
  reply: Reply
): Promise<Reply | null> => {
  try {
    const reviewDoc = doc(db, "reviews", review.id);
    await updateDoc(reviewDoc, {
      replies: [...review.replies, reply],
    });
    toast.success("added reply successfully");
    return reply;
  } catch (error) {
    console.error("Error adding reply:", error);
    return null;
  }
};

export const deleteReply = async (
  reviewId: string,
  replyIndex: number
): Promise<Reply[] | null> => {
  try {
    // Step 1: Fetch the review document from Firestore
    const reviewDocRef = doc(db, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewDocRef);

    if (reviewDoc.exists()) {
      const reviewData = reviewDoc.data() as Review;

      // Step 2: Check if replies exist in the review data
      const existingReplies = reviewData?.replies || [];

      // Step 3: Remove the reply at the specified index
      const updatedReplies = existingReplies.filter(
        (_: any, index: number) => index !== replyIndex
      );

      // Step 4: Update the Firestore document with the updated replies array
      await updateDoc(reviewDocRef, {
        replies: updatedReplies,
      });
      toast.success("reply was successfully removed");
      return updatedReplies;
    } else {
      console.log("reply does not exists.");
      return null;
    }
  } catch (error) {
    console.error("Error deleting reply: ", error);
    return null;
  }
};

export function listenToCheckoutSession(
  uid: string,
  sessionId: string,
  callback: (data: any) => void
) {
  const firestore = getFirestore();
  const sessionDocRef = doc(
    firestore,
    `users/${uid}/checkout_sessions/${sessionId}`
  );

  // Listen for changes in the session document
  onSnapshot(sessionDocRef, (snapshot: DocumentSnapshot) => {
    const sessionData = snapshot.data();
    if (sessionData) {
      callback(sessionData);
    }
  });
}

export const checkIfFirstSubscription = async (uid: string) => {
  try {
    const userDocRef = doc(db, "users", uid);

    const subscriptionsCollectionRef = collection(userDocRef, "subscriptions");
    const previousSubscriptionsSnapshot = await getDocs(
      subscriptionsCollectionRef
    );

    return previousSubscriptionsSnapshot.docs.length <= 1;
  } catch (error) {
    console.error(error);
    return false;
  }
};
