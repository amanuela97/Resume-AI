"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../store";
import { fetchCoverLettersFromFirestore } from "@/app/utils/firebase";
import { CoverLetter } from "@/app/utils/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { formatToText } from "../utils/helper";

const CoverLetterPage = () => {
  const [loading, setLoading] = useState(true);
  const { user, coverLetters, setCoverLetters } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const fetchCoverLetters = async () => {
      if (user?.uid) {
        const data = await fetchCoverLettersFromFirestore(user.uid);
        setCoverLetters(data);
        setLoading(false);
      }
    };

    fetchCoverLetters();
  }, [user, setCoverLetters]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Your Cover Letters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coverLetters.map((coverLetter: CoverLetter) => (
            <Card
              key={coverLetter.id}
              className="bg-card shadow-lg cursor-pointer"
              onClick={() => router.push(`/cover-letter/${coverLetter.id}`)}
            >
              <CardHeader className="bg-primary-light mb-2">
                <CardTitle className="text-primary font-bold">
                  {coverLetter.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="truncate">
                  {formatToText(coverLetter.content.split(/\r?\n/)[0])}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CoverLetterPage;
