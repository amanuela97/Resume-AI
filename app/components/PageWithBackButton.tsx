import React from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageWithBackButtonProps {
  children: React.ReactNode;
  title: string;
  callback: () => void;
}

export default function PageWithBackButton(
  { children, title, callback }: PageWithBackButtonProps = {
    children: null,
    title: "Default Title",
    callback: () => {},
  }
) {
  return (
    <main className="container mx-auto px-4 py-8 bg-background min-h-screen my-4">
      <div className="flex items-center mb-8 gap-4">
        <Button
          onClick={callback}
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 dark:hover:bg-white/10 hover:bg-black/10"
          aria-label="Back Button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
      </div>
      {children}
    </main>
  );
}
