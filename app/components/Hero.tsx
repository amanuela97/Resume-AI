"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle, storeUserData } from "@/app/utils/firebase";
import { useAppStore } from "@/app/store";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import { Button } from "@/app/components/ui/button";

export default function Hero() {
  const router = useRouter();
  const { setUser, user } = useAppStore();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      const customUser = await storeUserData(user);
      setUser(customUser);
      router.push("/create");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  return (
    <section className="pt-44 pb-14 px-8 max-w-6xl mx-auto mb-2 z-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Intelligent Resume Optimizer</h1>
      <p className="text-xl mb-8">
        Optimize your resume for job applications using AI
      </p>
      {user ? (
        <Button
          onClick={() => router.push("/create")}
          /* className="w-fit px-6 bg-button-background py-2 hover:bg-card/80 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors" */
          className="bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
        >
          Start Using Resume AI
        </Button>
      ) : (
        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          className="px-6 py-2 rounded-lg transition-colors dark:text-button-text"
        >
          Continue with Google
        </GoogleSignInButton>
      )}
    </section>
  );
}
