"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/utils/firebase";
import CoverLetterComponent from "@/app/components/CoverLetter";
import Loader from "@/app/components/Loader";
import { useAppStore } from "@/app/store";
import { doc, getDoc } from "firebase/firestore";
import { CoverLetter } from "@/app/utils/types";
import { Button } from "@/app/components/ui/button";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";

const CoverLetterDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { coverLetter, setCoverLetter } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      setLoading(true);
      if (id && typeof id === "string") {
        const docRef = doc(db, "coverLetters", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCoverLetter(docSnap.data() as CoverLetter);
        } else {
          console.error("No such document!");
        }
      }
      setLoading(false);
    };

    fetchCoverLetter();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.push("/cover-letter")} className="mb-4">
          Show All Cover Letters
        </Button>
        {coverLetter ? (
          <CoverLetterComponent />
        ) : (
          <div>Cover Letter not found</div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CoverLetterDetailPage;
