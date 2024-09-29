"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAnalysis } from "@/app/utils/firebase";
import AnalysisResults from "@/app/components/AnalysisResults";
import { Button } from "@/app/components/ui/button";
import Loader from "@/app/components/Loader";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppStore } from "@/app/store";

export default function AnalysisDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { setAnalysis } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setLoading(true);
      if (id && typeof id === "string") {
        const analysisData = await fetchAnalysis(id);
        if (analysisData) {
          setAnalysis(analysisData);
        }
      }
      setLoading(false);
    };

    fetchAnalysisData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.push("/analyses")} className="mb-4">
          Show All Analyses
        </Button>
        <AnalysisResults />
      </div>
    </ProtectedRoute>
  );
}
