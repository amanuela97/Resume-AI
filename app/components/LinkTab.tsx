"use client";

import { useState } from "react";
import { useAppStore } from "@/app/store";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-toastify";

export default function LinkTab() {
  const [url, setUrl] = useState("");
  const { setJobDescription, setIsExtracting, isExtracting } = useAppStore();

  const handleExtract = async () => {
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }

    setIsExtracting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/extract`,
        {
          method: "POST",
          body: new URLSearchParams({ url }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error ? JSON.stringify(error) : "Extraction failed");
      }

      const data = await response.json();
      setJobDescription(data.text);
      toast.success("Text extracted successfully!");
    } catch (error: any) {
      console.error("Error extracting text:", error);
      toast.error("Failed to extract text.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div>
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter the job description URL"
        className="mb-4 border-secondary focus:ring-accent p-2"
      />
      <Button
        onClick={handleExtract}
        disabled={isExtracting}
        className="bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
      >
        {isExtracting ? "Extracting..." : "Extract"}
      </Button>
    </div>
  );
}
