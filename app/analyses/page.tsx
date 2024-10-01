"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import { fetchAnalyses } from "@/app/utils/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Analyses() {
  const { user, analyses, setAnalyses } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const fetchAnalysesData = async () => {
      if (user) {
        const analysesData = await fetchAnalyses(user);
        setAnalyses(analysesData);
      }
    };
    fetchAnalysesData();
  }, [user, setAnalyses]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">Analyses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="bg-card shadow-lg cursor-pointer"
              onClick={() => router.push(`/analyses/${analysis.id}`)}
            >
              <CardHeader className="bg-primary-light mb-2">
                <CardTitle className="text-primary font-bold">
                  {analysis.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{analysis.match_score} / 100</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
