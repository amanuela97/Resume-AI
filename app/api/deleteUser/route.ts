import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json(
      { success: false, message: "uid not found" },
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

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    return NextResponse.json(
      {
        success: true,
        message: `User deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
