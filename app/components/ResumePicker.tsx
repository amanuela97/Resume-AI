"use client";

import { useEffect, useState } from "react";
import ImageNext from "next/image";
import { Search, Plus, Check, Download, Lock } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Button } from "@/app/components/ui/button";
import { useAppStore } from "../store";
import { convertToFormData } from "../utils/helper";
import DocxPreview from "./DocxPreview";
import { toast } from "react-toastify";
import { colorOptions } from "../utils/constants";
import { TemplateMetada } from "../utils/types";
import { fetchTemplateMetadata } from "../utils/firebase";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import PremiumFeatureModal from "./PremiumFeatureModal";
import axios from "axios";

export default function ResumePicker() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateMetada | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [docBuffer, setDocBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { resumeInfo, templates, setTemplates } = useAppStore();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearchQuery = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSelectedColor = selectedColor
      ? template.colors.includes(selectedColor)
      : true;
    return matchesSearchQuery && matchesSelectedColor;
  });

  useEffect(() => {
    const handleFetchTemplates = async () => {
      const templates = await fetchTemplateMetadata();
      if (!templates || templates.length === 0) return;
      setTemplates(templates);
    };

    handleFetchTemplates();
  }, []);

  useEffect(() => {
    const loadImage = (template: TemplateMetada) => {
      if (!imagesLoaded[template.id]) {
        const img = new Image();
        img.src = template.previewImageURL;
        img.alt = template.name;
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, [template.id]: true }));
        };
      }
    };

    filteredTemplates.forEach(loadImage);
  }, [filteredTemplates]);

  const handleSelection = async (template: TemplateMetada) => {
    if (template.isPremium) {
      setShowModal(true);
      return;
    }
    setIsLoading(true);
    setSelectedTemplate(template);
    const formData = convertToFormData(resumeInfo);
    formData.append("template", template.docxFileURL);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/template`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      setDocBuffer(buffer);
    } else {
      alert("Failed to generate document");
    }
  };

  const downloadFile = async (type: string) => {
    let mimeType: string = "";
    let fileName: string = "";

    if (type === "docx") {
      if (!docBuffer) {
        console.log("docBuffer undefined");
        toast.error("Download Failed");
        return;
      }
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      fileName = "resume.docx";
    } else if (type === "pdf") {
      if (!pdfBlob) {
        console.log("pdfBlob undefined");
        toast.error("Download Failed");
        return;
      }

      if (docBuffer) {
        const pdfBlob = await convertDocxBufferToPdf({ docBuffer });
        setPdfBlob(pdfBlob);
      }
      mimeType = "application/pdf";
      fileName = "resume.pdf";
    } else {
      console.log("Invalid file type");
      toast.error("Invalid file type");
      return;
    }
    setIsDownloading(true);
    const downloadBlob =
      type === "docx" ? new Blob([docBuffer!], { type: mimeType }) : pdfBlob;
    const url = window.URL.createObjectURL(downloadBlob!);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  const convertDocxBufferToPdf = async ({
    docBuffer,
  }: {
    docBuffer: ArrayBuffer;
  }) => {
    const apiKey = process.env.NEXT_PUBLIC_CLOUDMERSIVE_API_KEY; // Ensure you have this in your .env.local or .env.production
    const url = "https://api.cloudmersive.com/convert/docx/to/pdf";

    try {
      const response = await axios.post(url, docBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          Apikey: apiKey,
        },
        responseType: "blob", // Specify the response type as Blob
      });

      // Check if the response is valid
      if (response.status !== 200) {
        throw new Error("Failed to convert DOCX to PDF");
      }

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      return pdfBlob;
    } catch (error) {
      console.error("Error converting DOCX to PDF:", error);
      throw error;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col lg:flex-row h-full p-2">
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
                  style={{ backgroundColor: selectedColor || "#7c7979" }}
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-card">
                <div className="space-y-2">
                  <h3 className="font-medium leading-none">Color</h3>
                  <div className="flex flex-wrap gap-1">
                    {colorOptions.map(({ value }) => (
                      <button
                        key={value}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: value }}
                        onClick={() =>
                          setSelectedColor((prev) => (prev ? "" : value))
                        }
                      >
                        {value === selectedColor && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-auto lg:h-[calc(100vh-112px)] p-2 bg-gray-100 border border-gray-300 scrollbar scrollbar-thumb-gray-800 scrollbar-track-gray-200 overflow-y-scroll">
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Tooltip key={template.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`cursor-pointer rounded-lg overflow-hidden border border-gray-400 relative ${
                          selectedTemplate?.id === template.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => handleSelection(template)}
                      >
                        {imagesLoaded[template.id] ? (
                          <>
                            <ImageNext
                              src={template.previewImageURL}
                              alt={template.name}
                              width={300}
                              height={420}
                              loading="lazy"
                            />
                            {template.isPremium && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-full p-2">
                                  <Lock className="text-black w-6 h-6" />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <SkeletonLoader />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card">
                      <p>
                        {template.name}
                        {template.isPremium ? " (Premium)" : ""}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <p>No templates found</p>
              )}
            </div>
          </div>
          <PremiumFeatureModal
            title="Premium Feature"
            description="This template is only available to premium users. Upgrade your account to access all the templates!"
            onAcknowledge={() => setShowModal(false)}
            triggerOpen={showModal}
          />
        </div>

        <div className="w-full lg:w-1/2 p-4 flex items-center justify-center min-h-[40vh] lg:min-h-0 relative mb-6">
          <div
            className={`absolute top-4 right-4 z-10  transition-opacity duration-700 ease-in-out ${
              docBuffer ? "block" : "hidden"
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mr-2">
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card " align="end">
                <DropdownMenuItem
                  onClick={() => downloadFile("docx")}
                  className="hover:bg-black/20 cursor-pointer"
                >
                  Download Docx
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => downloadFile("pdf")}
                  className="hover:bg-black/20 cursor-pointer"
                >
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full h-full flex items-center justify-center mt-6">
            <DocxPreview
              pdfBlob={pdfBlob}
              templateName={selectedTemplate?.name ?? "default"}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
