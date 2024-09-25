"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import { db } from "@/app/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import type { Analyses } from "@/app/utils/types";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Analyses() {
  const { user, analyses, setAnalyses } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchAnalyses = async () => {
        const q = query(
          collection(db, "analyses"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const analysesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnalyses(analysesData as Analyses);
      };

      fetchAnalyses();
    }
  }, [user, setAnalyses]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
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
