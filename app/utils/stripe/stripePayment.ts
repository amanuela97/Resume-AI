import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase";
import { CustomUser } from "../types";
import initializeStripe from "./stripe";

export async function createCheckoutSession(uid: string, price: string) {
  const firestore = getFirestore();

  // Create a new checkout session in the subcollection inside this user's document
  const checkoutSessionRef = await addDoc(
    collection(doc(firestore, "users", uid), "checkout_sessions"),
    {
      price: price,
      success_url: process.env.NEXT_PUBLIC_BASE_URL_SUCCESS,
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL_CANCEL,
    }
  );

  // Wait for the CheckoutSession to get attached by the Stripe Firebase extension
  onSnapshot(checkoutSessionRef, async (snap) => {
    const { sessionId } = snap.data() as { sessionId: string };
    if (sessionId) {
      // We have a session, let's redirect to Checkout
      // Init Stripe
      const stripe = await initializeStripe();
      stripe.redirectToCheckout({ sessionId });
    }
  });
}

export const getPortalUrl = async (user: CustomUser): Promise<string> => {
  let dataWithUrl: any;
  try {
    const functions = getFunctions(app, "europe-central2");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user.uid,
      returnUrl: process.env.NEXT_PUBLIC_BASE_URL_RETURN
        ? process.env.NEXT_PUBLIC_BASE_URL_RETURN
        : window.location.origin,
    });

    // Add a type to the data
    dataWithUrl = data as { url: string };
  } catch (error) {
    console.error(error);
  }

  return new Promise<string>((resolve, reject) => {
    if (dataWithUrl?.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};
