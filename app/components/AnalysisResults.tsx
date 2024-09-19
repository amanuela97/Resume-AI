"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons
import { Button } from "../components/ui/button"; // Ensure Button component is imported
import { Modal } from "../components/ui/modal"; // Import the Modal component
import { saveAnalysisToFirestore } from "../utils/firebase"; // Import the save function
import DownloadButton from "@/app/components/DownloadButton"; // Import the DownloadButton component
import { toast } from "react-toastify";
import { Analysis } from "@/app//utils/types";
import { v4 as uuidv4 } from "uuid";

type analysisType = Omit<Analysis, "id" | "name" | "userId"> | null;
type AnalysisResultsProp = {
  analysis: analysisType;
};

export default function AnalysisResults({ analysis }: AnalysisResultsProp) {
  const { user, analyses, setAnalyses } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");

  useEffect(() => {
    if (analysis) {
      setIsVisible(true);
    }
  }, [analysis]);

  const handleSaveAnalysis = async () => {
    if (analysisName.trim() === "") {
      toast.info("Please provide a name for the analysis.");
      return;
    } else if (!user?.uid || !analysis) {
      console.error("no userID found");
      toast.info("Unable to create analysis.");
      return;
    } else if (!analysis) {
      console.error("analysis is undefined");
      toast.info("Unable to create analysis.");
      return;
    }

    try {
      const id = uuidv4();
      await saveAnalysisToFirestore({
        ...analysis,
        name: analysisName,
        userId: user?.uid,
        id,
      });
      toast.success("Analysis saved successfully!");
      setAnalyses([
        ...analyses,
        { ...analysis, name: analysisName, userId: user?.uid, id },
      ]);
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("Failed to save analysis.");
    } finally {
      setIsModalOpen(false);
      setAnalysisName(""); // Clear the input
    }
  };

  if (!analysis) {
    return (
      <Card className="mt-8 bg-card shadow-lg">
        <CardHeader className="bg-primary-light mb-2">
          <CardTitle className="text-primary font-bold">
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-card-foreground">
          <p className="text-muted-foreground">
            Upload a resume and provide a job description to see the analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { match_score, strengths, weaknesses, recommendation } = analysis;

  return (
    <Card
      className={`mt-8 bg-card shadow-lg transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <CardHeader className="bg-primary-light mb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-primary font-bold">
          Analysis Results
        </CardTitle>
        <div className="flex items-center">
          <DownloadButton analysis={analysis} />{" "}
          {/* Add the DownloadButton here */}
          <Button onClick={() => setIsModalOpen(true)} className="bg-accent">
            Save Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-card-foreground">
        {/* Match Score Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Match Score: {match_score}/100
          </h2>
          <div className="mt-1">
            {match_score >= 80 && (
              <span className="text-success font-medium">Excellent Match</span>
            )}
            {match_score >= 60 && match_score < 80 && (
              <span className="text-primary font-medium">Good Match</span>
            )}
            {match_score < 60 && (
              <span className="text-error font-medium">Needs Improvement</span>
            )}
          </div>
        </div>

        {/* Strengths Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Strengths</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-center">
                <FaCheckCircle className="mr-2 text-success" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Weaknesses</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-center">
                <FaTimesCircle className="mr-2 text-error" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendation Section */}
        <div>
          <h3 className="text-lg font-medium">Recommendation</h3>
          <p className="mt-2">{recommendation}</p>
        </div>
      </CardContent>

      {/* Modal for saving analysis */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 bg-background">
          <h2 className="text-lg font-bold mb-2">Save Analysis</h2>
          <input
            type="text"
            value={analysisName}
            onChange={(e) => setAnalysisName(e.target.value)}
            placeholder="Enter a name for the analysis"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveAnalysis} className="bg-accent">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
