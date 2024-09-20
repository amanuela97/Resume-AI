"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle, storeUserData } from "./utils/firebase";
import { useAppStore } from "./store";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";

export default function Home() {
  const router = useRouter();
  const { setUser, user } = useAppStore();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        await storeUserData(user);
        setUser(user);
        router.push("/create");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Intelligent Resume Optimizer
        </h1>
        <p className="text-xl mb-8">
          Optimize your resume for job applications using AI
        </p>
        {user ? (
          <button
            onClick={() => router.push("/create")}
            className="w-fit px-6 py-2bg-primary-light text-gray-800 hover:bg-card/80 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors"
          >
            Start Using Resume AI
          </button>
        ) : (
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            className="px-6 py-2 rounded-lg transition-colors"
          >
            Continue with Google
          </GoogleSignInButton>
        )}
      </div>
    </div>
  );
}
