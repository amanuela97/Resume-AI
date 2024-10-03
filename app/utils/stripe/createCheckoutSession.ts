import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import initializeStripe from "./stripe";

export async function createCheckoutSession(uid: string) {
  const firestore = getFirestore();

  // Create a new checkout session in the subcollection inside this user's document
  const checkoutSessionRef = await addDoc(
    collection(doc(firestore, "users", uid), "checkout_sessions"),
    {
      price: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
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
