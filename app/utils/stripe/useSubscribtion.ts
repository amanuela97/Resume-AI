import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { CustomUser, Subscription } from "../types";

export function useSubscription(user: CustomUser | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("No user is currently logged in.");
      setLoading(false);
      return;
    }

    const firestore = getFirestore();
    const subscriptionsRef = collection(
      firestore,
      "users",
      user.uid,
      "subscriptions"
    );

    const q = query(
      subscriptionsRef,
      where("status", "in", ["trialing", "active"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          // Get the first active or trialing subscription
          const doc = snapshot.docs[0];
          const data = doc.data() as Subscription;
          setSubscription({ ...data, id: doc.id });
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching subscription: ", err);
        setError("Failed to fetch subscription.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return { subscription, loading, error, setSubscription };
}
