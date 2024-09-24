import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-foreground">
      <h1 className="text-4xl font-bold mb-2">Not Found</h1>
      <p className="text-xl mb-8">Could not find requested resource.</p>
      <Button asChild className="bg-card">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
