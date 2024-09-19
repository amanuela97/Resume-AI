"use client";

import { useState } from "react";
import { useAppStore } from "@/app/store";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";
import { ExtractionStatusType } from "../utils/types";

export default function LinkTab() {
  const [url, setUrl] = useState("");
  const {
    setJobDescription,
    setIsExtracting,
    extractionStatus,
    setExtractionStatus,
    isExtracting,
  } = useAppStore();

  const handleExtract = async () => {
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }

    setIsExtracting(true);
    setExtractionStatus(ExtractionStatusType.idle);

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
      setExtractionStatus(ExtractionStatusType.success);
      toast.success("Text extracted successfully!");
    } catch (error: any) {
      console.error("Error extracting text:", error);
      setExtractionStatus(ExtractionStatusType.fail);
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
        className="mb-4 border-secondary focus:ring-accent bg-white p-2"
      />
      <Button
        onClick={handleExtract}
        disabled={isExtracting}
        className="bg-accent"
      >
        {isExtracting ? "Extracting..." : "Extract"}
      </Button>
      {extractionStatus !== "idle" && (
        <div className="mt-2 flex items-center">
          {extractionStatus === "success" ? (
            <>
              <CheckCircle className="text-green-500 mr-2" />
              <span className="text-green-700">Extraction successful</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 mr-2" />
              <span className="text-red-700">Extraction failed</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
