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
import { RiLockStarFill } from "react-icons/ri";
import {
  Analysis,
  AnalysisResponseType,
  ContentType,
  CoverLetter,
  CoverLetterResponseType,
} from "../utils/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp } from "firebase/firestore";
import PremiumFeatureModal from "../components/PremiumFeatureModal";
import { useSubscription } from "../utils/stripe/useSubscribtion";
import { parse, STR, OBJ } from "partial-json";
import { formatCoverLetterBody } from "../utils/helper";

export default function Create() {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState<null | ContentType>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState(false);
  const {
    user,
    file,
    jobDescription,
    setCoverLetter,
    setAnalysis,
    analysis,
    coverLetter,
  } = useAppStore();
  const { subscription } = useSubscription(user);

  const isPremiumUser = subscription?.status === "active";

  const handleCreate = async (contentType: ContentType) => {
    if (!isPremiumUser) {
      setShowModal(true);
      return;
    }

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

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream available");

      const decoder = new TextDecoder();
      let partialData = ""; // Variable to hold partial JSON chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to partialData
        partialData += decoder.decode(value, { stream: true });

        // Parse the partial JSON data with `Allow.STR | Allow.OBJ` to allow incomplete strings and objects
        const parsedChunk = parse(partialData, STR | OBJ);
        // Update state based on the parsed chunk
        updateStateFromStream(parsedChunk, contentType);
      }

      // Attempt to fully parse the JSON once the stream is complete
      const finalData = parse(partialData); // Parse the final complete data
      updateStateFromStream(finalData, contentType);

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

  const updateStateFromStream = (
    data: Partial<AnalysisResponseType | CoverLetterResponseType>,
    contentType: ContentType
  ) => {
    setIsVisible(contentType);
    if (contentType === ContentType.analysis) {
      const analysisData = data as Partial<Analysis>;
      if (!analysisData) return;
      const { match_score, strengths, weaknesses, recommendation } =
        analysisData ?? {};
      setAnalysis({
        ...analysis,
        match_score: match_score ?? 0, // Ensure match_score is always a number
        recommendation: recommendation ?? "", // Ensure recommendation is always a string
        strengths: strengths ?? [],
        weaknesses: weaknesses ?? [],
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else if (contentType === ContentType.coverLetter) {
      const coverLetterData = data as Partial<CoverLetterResponseType>;
      if (!coverLetterData || !user?.uid) return;
      const { introduction, body, conclusion } = coverLetterData ?? {};
      const contentData = {
        introduction: introduction ?? "",
        body: {
          relevant_experience: body?.relevant_experience ?? "",
          skills_match: body?.skills_match ?? "",
          cultural_fit: body?.cultural_fit ?? "",
          motivation: body?.motivation ?? "",
        },
        conclusion: conclusion ?? "",
      };
      setCoverLetter({
        ...coverLetter,
        title: introduction ?? "",
        userId: user.uid,
        id: uuidv4(),
        content: formatCoverLetterBody(contentData), //
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
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
            <>
              {!isPremiumUser && (
                <RiLockStarFill className="inline-block mr-2" />
              )}
              Analyze Resume
            </>
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
            <>
              {!isPremiumUser && (
                <RiLockStarFill className="inline-block mr-2" />
              )}
              Create Cover Letter
            </>
          )}
        </Button>
        {isVisible === ContentType.coverLetter && <CoverLetterComponent />}
        {isVisible === ContentType.analysis && <AnalysisResults />}
        <PremiumFeatureModal
          title="Premium Feature"
          description="This feature is only available to premium users. Upgrade your account to access this and many other exclusive features!"
          onAcknowledge={() => setShowModal(false)}
          triggerOpen={showModal}
        />
      </main>
    </ProtectedRoute>
  );
}
