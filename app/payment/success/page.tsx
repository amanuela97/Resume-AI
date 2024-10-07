import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default async function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-2">Payment was successful. 🎉</h1>
      <div className="mt-5">
        <Link href="/">
          <Button variant="outline" className="bg-card shadow-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
