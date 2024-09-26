"use client";

import ProtectedRoute from "../components/ProtectedRoute"; // Import the ProtectedRoute component
import MultiStepForm from "../components/MultiStepForm";
import ResumePicker from "../components/ResumePicker";

export default function Create() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8 bg-background min-h-screen my-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">Resume Builder</h1>
        {/*<MultiStepForm />*/}
        <ResumePicker />
      </main>
    </ProtectedRoute>
  );
}
