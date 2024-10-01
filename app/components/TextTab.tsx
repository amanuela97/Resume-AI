"use client";

import { useAppStore } from "../store";
import { CardHeader, CardTitle, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { FaTrash } from "react-icons/fa"; // Import the FaTrash icon
import { Button } from "./ui/button"; // Ensure Button component is imported
import { JOB_DESCRIPTION_TEXT_LIMIT } from "../utils/constants";

export default function TextTab() {
  const { jobDescription, setJobDescription } = useAppStore();

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  const clearDescription = () => {
    setJobDescription("");
  };

  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between h-16 mb-2">
        <CardTitle className="text-primary font-bold">Text Content</CardTitle>
        <Button
          variant="destructive"
          size="icon"
          onClick={clearDescription}
          aria-label="Clear job description"
          className={`transition-opacity duration-700 ease-in-out ${jobDescription ? "opacity-100" : "opacity-0"
            }`}
        >
          <FaTrash className="w-4 h-4 text-neutral" /> {/* Use FaTrash icon */}
        </Button>
      </CardHeader>
      <CardContent className="text-card-foreground relative">
        <Textarea
          value={jobDescription}
          maxLength={JOB_DESCRIPTION_TEXT_LIMIT}
          onChange={handleDescriptionChange}
          placeholder="Paste the job description here..."
          className="h-40 mb-2 border-secondary focus:ring-accent p-2"
        />
        <span className="text-muted-foreground text-sm">
          {jobDescription.trim().length} / {JOB_DESCRIPTION_TEXT_LIMIT}{" "}
          characters
        </span>
      </CardContent>
    </div>
  );
}
