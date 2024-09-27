"use client";

import { useState } from "react";
import { Search, Plus, Check, Download } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { useAppStore } from "../store";
import { convertToFormData } from "../utils/helper";
import DocxPreview from "./DocxPreview";
import { toast } from "react-toastify";

interface Template {
  id: string;
  name: string;
  imageUrl: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "template-1",
    imageUrl: "/previews/template-1-preview.png",
  },
  {
    id: "2",
    name: "template-2",
    imageUrl: "/previews/template-2-preview.png",
  },
  {
    id: "3",
    name: "template-3",
    imageUrl: "/previews/template-3-preview.png",
  },
  {
    id: "4",
    name: "template-4",
    imageUrl: "/previews/template-4-preview.png",
  },
];

const colors = [
  "#FF1493",
  "#808080",
  "#4169E1",
  "#00BFFF",
  "#20B2AA",
  "#32CD32",
  "#9ACD32",
  "#FFD700",
  "#FFA500",
  "#FF4500",
  "#FF69B4",
  "#8A2BE2",
  "#000000",
];

export default function ResumePicker() {
  const [docBuffer, setDocBuffer] = useState<ArrayBuffer | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const { resumeInfo } = useAppStore();

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelection = async (template: Template) => {
    setSelectedTemplate(template);
    const formData = convertToFormData(resumeInfo);
    formData.append("template", template.name + ".docx");
    const response = await fetch("/api/template", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      setDocBuffer(buffer);
    } else {
      alert("Failed to generate document");
    }
  };

  const DownloadDocx = () => {
    if (!docBuffer) {
      toast.error("Download Failed");
      return;
    }
    const blob = new Blob([docBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.docx";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto">
      <div className="w-full lg:w-1/2 p-4 lg:border-r">
        <h1 className="text-2xl font-bold py-2">Pick A Template</h1>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search A4 templates"
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="absolute right-2 top-2 rounded-full p-1"
                style={{ backgroundColor: selectedColor }}
              >
                <Plus className="h-4 w-4 text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-card">
              <div className="space-y-2">
                <h3 className="font-medium leading-none">Color</h3>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color === selectedColor && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-112px)] p-2 bg-gray-100 border border-gray-300 scrollbar scrollbar-thumb-gray-800 scrollbar-track-gray-200 overflow-y-scroll">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer rounded-lg overflow-hidden border border-gray-400 ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleSelection(template)}
              >
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-4 flex items-center justify-center min-h-[40vh] lg:min-h-0  relative">
        {docBuffer && (
          <Button
            variant="outline"
            className={`absolute top-4 right-4 z-10 bg-green-500 hover:bg-green-700 transition-opacity duration-700 ease-in-out ${
              docBuffer ? "opacity-100" : "opacity-0"
            }`}
            onClick={DownloadDocx}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
        <div className="w-full h-full flex items-center justify-center">
          <DocxPreview docBuffer={docBuffer} />
        </div>
      </div>
    </div>
  );
}
