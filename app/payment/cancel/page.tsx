import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function Cancel() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-2">Payment Cancelled 😢</h1>
      <p className="leading-7">The good news is, you can try again 😊</p>
      <div className="mt-5">
        <Link href="/">
          <Button variant="outline" className="bg-card shadow-lg">
            Go back to home
          </Button>
        </Link>
      </div>
    </main>
  );
}
