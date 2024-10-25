"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa"; // Import icons
import { Button } from "../components/ui/button"; // Ensure Button component is imported
import { Modal } from "../components/ui/modal"; // Import the Modal component
import { db, saveAnalysisToFirestore } from "../utils/firebase"; // Import the save function
import DownloadButton from "@/app/components/DownloadButton"; // Import the DownloadButton component
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { ContentType, isTimestamp } from "../utils/types";
import { deleteDoc, doc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import moment from "moment";

export default function AnalysisResults() {
  const pathname = usePathname();
  const { user, analyses, analysis, setAnalyses, deleteAnalysis } =
    useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisTitle, setAnalysisTitle] = useState("");

  useEffect(() => {
    if (analysis) {
      setIsVisible(true);
    }
  }, [analysis]);

  const handleSaveAnalysis = async () => {
    if (analysisTitle.trim() === "") {
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
      const newAnalysis = {
        ...analysis,
        title: analysisTitle,
        userId: user.uid,
        id: uuidv4(),
      };
      await saveAnalysisToFirestore(newAnalysis);
      toast.success("Analysis saved successfully!");
      setAnalyses([...analyses, newAnalysis]);
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("Failed to save analysis.");
    } finally {
      setIsModalOpen(false);
      setAnalysisTitle(""); // Clear the input
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "analyses", id));
      deleteAnalysis(id);
      toast.success(`Deleted analysis successfully!`);
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast.error("Error deleting analysis");
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
          <DownloadButton contentType={ContentType.analysis} />{" "}
          {/* Add the DownloadButton here */}
          <Button onClick={() => setIsModalOpen(true)} className="bg-accent">
            Save Analysis
          </Button>
          {pathname !== "/create" && (
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (analysis.id) {
                  handleDelete(analysis.id);
                }
              }}
            >
              <FaTrash className="w-4 h-4 text-neutral" />
            </Button>
          )}
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

        {isTimestamp(analysis.createdAt) && isTimestamp(analysis.updatedAt) && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Created: {moment(analysis.createdAt.toDate()).fromNow()}</p>
            <p>Updated: {moment(analysis.updatedAt.toDate()).fromNow()}</p>
          </div>
        )}
      </CardContent>

      {/* Modal for saving analysis */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 bg-background">
          <h2 className="text-lg font-bold mb-2">Save Analysis</h2>
          <input
            type="text"
            value={analysisTitle}
            onChange={(e) => setAnalysisTitle(e.target.value)}
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
