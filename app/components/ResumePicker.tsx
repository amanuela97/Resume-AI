"use client";

import { useState } from "react";
import { Search, Plus, FileQuestion, Check } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface Template {
  id: string;
  name: string;
  imageUrl: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Template 1",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661779134041-9d618ec4c812?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    name: "Template 2",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Template 3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1683491155621-cd42e847d646?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    name: "Template 4",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    name: "Template 5",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    name: "Template 6",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    name: "Template 7",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-112px)] p-2 border border-gray-300  scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200 overflow-y-scroll">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer border rounded-lg overflow-hidden ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedTemplate(template)}
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

      <div className="w-full lg:w-1/2 p-4 flex items-center justify-center min-h-[50vh] lg:min-h-0 ">
        {selectedTemplate ? (
          <img
            src={selectedTemplate.imageUrl}
            alt={selectedTemplate.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <FileQuestion className="mx-auto h-12 w-12 mb-2" />
            <p>No resume selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
