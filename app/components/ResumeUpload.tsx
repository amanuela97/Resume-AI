"use client";

import { useAppStore } from "../store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { FILE_TYPES, FILE_EXTENSIONS } from "../utils/constants";
import { toast } from "react-toastify";

export default function ResumeUpload() {
  const { file, setFile } = useAppStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file && FILE_TYPES.includes(file.type)) {
        setFile(file);
      } else {
        setFile(null);
        toast.error(`File not supported: ${file && file.type}`);
      }
    }
  };

  return (
    <Card className="bg-card shadow-lg ">
      <CardHeader className="bg-primary-light flex flex-row items-center justify-between mb-2">
        <CardTitle className="text-primary font-bold">Upload Resume</CardTitle>
        <span className="text-muted-foreground text-sm">
          supported files: ({FILE_EXTENSIONS.toString()})
        </span>
      </CardHeader>
      <CardContent className="text-card-foreground">
        <Input
          type="file"
          accept={FILE_EXTENSIONS.toString()}
          onChange={handleFileChange}
          className="border-secondary focus:ring-accent"
        />
        {file && <p className="mt-2 font-medium">Selected file: {file.name}</p>}
      </CardContent>
    </Card>
  );
}
