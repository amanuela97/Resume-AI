import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { isPastCancelDate } from "@/app/utils/helper";
import { Subscription } from "@/app/utils/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(req: Request) {
  const { uid, subscriptionId } = await req.json();

  if (!uid || !subscriptionId) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters" },
      { status: 500 }
    );
  }

  try {
    // Initialize Firebase Admin if it's not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }

    const firestore = admin.firestore();
    const userDocRef = firestore.collection("users").doc(uid);
    const subscriptionRef = userDocRef
      .collection("subscriptions")
      .doc(subscriptionId);

    // Fetch subscription data from Firestore
    const subscriptionSnapshot = await subscriptionRef.get();
    const subscription = subscriptionSnapshot.data();

    if (!subscription || subscription.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: "No active subscription found",
        },
        { status: 404 }
      );
    }

    // Allow immediate cancellation if within the first 14 days
    if (!isPastCancelDate(subscription as Subscription)) {
      // Cancel the subscription immediately
      await stripe.subscriptions.cancel(subscriptionId);

      // Update Firestore to mark the subscription as canceled
      await subscriptionRef.update({
        status: "canceled",
        canceled_at: new Date(),
      });
      console.log("canceled");

      return NextResponse.json(
        {
          success: true,
          message: "Subscription canceled immediately.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Immediate cancellation is not allowed. Subscription will be canceled at the end of the billing period.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
