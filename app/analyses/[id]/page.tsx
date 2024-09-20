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
import { useAppStore } from "@/app/store";

export default function AnalysisDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { setAnalysis } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      if (id && typeof id === "string") {
        const docRef = doc(db, "analyses", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnalysis(docSnap.data() as Analysis);
        } else {
          console.error("No such document!");
        }
      }
      setLoading(false);
    };

    fetchAnalysis();
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
