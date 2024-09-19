import * as functions from "firebase-functions/v1";
import { initializeApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
const app: App = initializeApp();

// Nodemailer transporter setup (use your email service provider's details)
const transporter = nodemailer.createTransport({
  service: "gmail", // For example, using Gmail
  auth: {
    user: process.env.MAIL_USER, // Your email
    pass: process.env.MAIL_PASS, // Your email password
  },
});

const db = getFirestore(); // Initialize Firestore

export const sendWelcomeEmail = functions.auth
  .user()
  .onCreate(async (user: any) => {
    const email = user.email;
    const uid = user.uid; // User ID for tracking
    const displayName = user.displayName || "User";

    // Check Firestore if welcome email was already sent
    const userDoc = db.collection("users").doc(uid);
    const doc = await userDoc.get();

    if (doc.exists && doc.data()?.welcomeEmailSent) {
      console.log(`Welcome email already sent to ${email}: ${app?.name}`);
      return;
    }

    // Create email content
    const mailOptions = {
      from: "Resume AI",
      to: email as string,
      subject: "Welcome to Resume AI!",
      text: `Hello ${displayName},\n\nWelcome to Resume AI! We're excited to have you onboard.\n\nBest regards,\nResume AI Team`,
      html: `<p>Hello <b>${displayName}</b>,</p><p>Welcome to <b>Resume AI</b>! We're excited to have you onboard.</p><p>Best regards,<br/>Resume AI Team</p>`,
    };

    try {
      // Send the email
      console.log(process.env.MAIL_USER);
      await transporter.sendMail(mailOptions);

      // Mark in Firestore that the welcome email has been sent
      await userDoc.set({ welcomeEmailSent: true }, { merge: true });

      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  });
