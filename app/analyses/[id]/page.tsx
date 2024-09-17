"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import AnalysisResults from "@/app/components/AnalysisResults";
import { Analysis } from "@/app/utils/types";
import { Button } from "@/app/components/ui/button";
import Loader from "@/app/components/Loader";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AnalysisDetail() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id || typeof id !== "string") {
        console.error(`id: ${id} does not exist or is malformed`);
        return;
      }
      const docRef = doc(db, "analyses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAnalysis(docSnap.data() as Analysis);
      } else {
        console.error("No such document!");
      }
    };

    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.push("/analyses")} className="mb-4">
          Show All Analyses
        </Button>
        <AnalysisResults analysis={analysis} />
      </div>
    </ProtectedRoute>
  );
}
