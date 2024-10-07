"use client";

import React from "react";
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
import { v4 as uuidv4 } from "uuid";
import { formatCoverLetterBody } from "../utils/helper";
import { serverTimestamp } from "firebase/firestore";

export default function Create() {
  const [isVisible, setIsVisible] = useState<null | ContentType>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState(false);
  const { user, file, jobDescription, setCoverLetter, setAnalysis } =
    useAppStore();

  const handleCreate = async (contentType: ContentType) => {
    if (!file || !jobDescription) {
      toast.error("Please upload a resume and provide a job description.");
      return;
    } else if (!user?.uid) {
      console.error("no userID found");
      toast.info("Unable to create coverLetter.");
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
        if (error?.error) {
          toast.error(error.error);
        }
        throw new Error(
          error ? JSON.stringify(error) : `${contentType} failed to be created`
        );
      }

      if (contentType === ContentType.analysis) {
        const { analysis }: AnalysisResponseType = await response.json();
        setAnalysis({
          ...analysis,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      } else if (contentType === ContentType.coverLetter) {
        const { coverLetter }: CoverLetterResponseType = await response.json();
        setCoverLetter({
          title: coverLetter.introduction,
          userId: user.uid,
          id: uuidv4(),
          content: formatCoverLetterBody(coverLetter), //
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
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
          className="text-xs sm:text-base mt-8 bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
        >
          {isLoadingAnalysis ? (
            <>
              <span className="animate-spin mr-2">&#9696;</span>
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </Button>
        <Button
          onClick={() => handleCreate(ContentType.coverLetter)}
          disabled={isLoadingCoverLetter}
          className="text-xs sm:text-base mt-8 mx-2 bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
        >
          {isLoadingCoverLetter ? (
            <>
              <span className="animate-spin mr-2">&#9696;</span>
              Creating Cover Letter...
            </>
          ) : (
            "Create Cover Letter"
          )}
        </Button>
        {isVisible === ContentType.coverLetter && <CoverLetterComponent />}
        {isVisible === ContentType.analysis && <AnalysisResults />}
      </main>
    </ProtectedRoute>
  );
}
