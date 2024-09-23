"use client";

import ProtectedRoute from "../components/ProtectedRoute"; // Import the ProtectedRoute component
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalysisResults from "@/app/components/AnalysisResults";
import CoverLetterComponent from "@/app/components/CoverLetter";
import { useAppStore } from "../store";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import {
  AnalysisResponseType,
  ContentType,
  CoverLetterResponseType,
} from "../utils/types";
import { useState } from "react";

export default function Create() {
  const [isVisible, setIsVisible] = useState<null | ContentType>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState(false);
  const { file, jobDescription, setCoverLetter, setAnalysis } = useAppStore();

  const handleCreate = async (contentType: ContentType) => {
    if (!file || !jobDescription) {
      toast.error("Please upload a resume and provide a job description.");
      return;
    }

    if (contentType === ContentType.analysis) {
      setIsLoadingAnalysis(true);
    } else if (contentType === ContentType.coverLetter) {
      setIsLoadingCoverLetter(true);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);
    formData.append("contentType", contentType);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error ? JSON.stringify(error) : `${contentType} failed to be created`
        );
      }

      if (contentType === ContentType.analysis) {
        const { analysis }: AnalysisResponseType = await response.json();
        setAnalysis(analysis);
      } else if (contentType === ContentType.coverLetter) {
        const { coverLetter }: CoverLetterResponseType = await response.json();
        setCoverLetter(coverLetter);
      }

      setIsVisible(contentType);
      toast.success(`${contentType} created successfully!`);
    } catch (error: any) {
      console.error(error);
      toast.error(`Error creating ${contentType}`);
    } finally {
      if (contentType === ContentType.analysis) {
        setIsLoadingAnalysis(false);
      } else if (contentType === ContentType.coverLetter) {
        setIsLoadingCoverLetter(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8 bg-background min-h-screen my-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Intelligent Resume Optimizer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ensure ResumeUpload has auto height */}
          <div className="h-auto">
            <ResumeUpload />
          </div>

          {/* Allow JobDescription to grow and take up remaining space */}
          <div className="flex-grow">
            <JobDescription />
          </div>
        </div>
        <Button
          onClick={() => handleCreate(ContentType.analysis)}
          disabled={isLoadingAnalysis}
          className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isLoadingAnalysis ? "Analyzing..." : "Analyze Resume"}
        </Button>
        <Button
          onClick={() => handleCreate(ContentType.coverLetter)}
          disabled={isLoadingCoverLetter}
          className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isLoadingCoverLetter
            ? "Creating Cover Letter..."
            : "Create Cover Letter"}
        </Button>
        {isVisible === ContentType.coverLetter && <CoverLetterComponent />}
        {isVisible === ContentType.analysis && <AnalysisResults />}
      </main>
    </ProtectedRoute>
  );
}
