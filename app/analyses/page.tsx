"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import { db } from "@/app/utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { FaTrash } from "react-icons/fa";
import type { Analyses } from "@/app/utils/types";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Analyses() {
  const { user, analyses, setAnalyses, deleteAnalysis } = useAppStore();
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

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "analyses", id));
      deleteAnalysis(id);
    } catch (error) {
      console.error("Error deleting analysis:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold text-center mb-8">Analyses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="bg-card shadow-lg cursor-pointer"
              onClick={() => router.push(`/analyses/${analysis.id}`)}
            >
              <CardHeader className="bg-primary-light flex justify-between items-center">
                <CardTitle className="text-primary font-bold">
                  {analysis.name}
                </CardTitle>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(analysis.id);
                  }}
                >
                  <FaTrash className="w-4 h-4 text-neutral" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
