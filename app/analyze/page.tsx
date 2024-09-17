"use client";

import ProtectedRoute from "../components/ProtectedRoute"; // Import the ProtectedRoute component
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalysisResults from "../components/AnalysisResults";
import { useAppStore } from "../store";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import { AnalysisResponseType } from "../utils/types";
import { useState } from "react";

export default function Analyze() {
  const [analysis, setAnalysis] = useState<
    AnalysisResponseType["analysis"] | null
  >(null);
  const { file, jobDescription, isLoading, setIsLoading } = useAppStore();

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      toast.error("Please upload a resume and provide a job description.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error ? JSON.stringify(error) : "Analysis failed");
      }

      const data: AnalysisResponseType = await response.json();
      setAnalysis(data.analysis);
      toast.success("Analysis completed successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`An error occurred during analysis`);
    } finally {
      setIsLoading(false);
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
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isLoading ? "Analyzing..." : "Analyze Resume"}
        </Button>
        <AnalysisResults analysis={analysis} />
      </main>
    </ProtectedRoute>
  );
}
