"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultiStepForm from "../components/MultiStepForm";
import ResumePicker from "../components/ResumePicker";
import PageWithBackButton from "../components/PageWithBackButton";
import { useRouter } from "next/navigation";

export default function Create() {
  const [showResumePicker, setShowResumePicker] = useState(false);
  const router = useRouter();

  const handleFormSubmit = () => {
    setShowResumePicker(true);
  };

  const navigateBack = () => {
    if (showResumePicker) {
      setShowResumePicker(false);
    } else {
      router.push("/");
    }
  };

  return (
    <PageWithBackButton title="Buil A Resume" callback={navigateBack}>
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
    </PageWithBackButton>
  );
}
