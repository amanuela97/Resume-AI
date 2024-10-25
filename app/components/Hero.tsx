"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle, storeUserData } from "@/app/utils/firebase";
import { useAppStore } from "@/app/store";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      const customUser = await storeUserData(user);
      setUser(customUser);
      router.push("/build");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  return (
    <section className="pt-44 pb-14 px-8 max-w-6xl mx-auto mb-2 z-10 text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Intelligent Resume Optimizer</h1>
      <p className="text-xl mb-8">
        Optimize your resume for job applications using AI
      </p>
      <div className="flex flex-col items-stretch p-4 w-fit gap-6">
        <Link href={"/build"} onClick={() => router.push("/build")}>
          <Button className="bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text">
            Build A Resume
          </Button>
        </Link>
        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          className="px-6 py-2 rounded-lg transition-colors dark:text-button-text"
        >
          Continue with Google
        </GoogleSignInButton>
      </div>
    </section>
  );
}
