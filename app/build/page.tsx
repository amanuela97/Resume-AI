"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import MultiStepForm from "../components/MultiStepForm";
import ResumePicker from "../components/ResumePicker";
import { Button } from "../components/ui/button";

export default function Create() {
  const [showResumePicker, setShowResumePicker] = useState(false);

  const handleFormSubmit = () => {
    setShowResumePicker(true);
  };

  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8 bg-background min-h-screen my-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Resume Builder</h1>
          {showResumePicker && (
            <Button onClick={() => setShowResumePicker(false)}>
              Back to Form
            </Button>
          )}
        </div>
        <AnimatePresence mode="wait">
          {!showResumePicker ? (
            <motion.div
              key="multistepform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MultiStepForm onSubmit={handleFormSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="resumepicker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResumePicker />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ProtectedRoute>
  );
}
