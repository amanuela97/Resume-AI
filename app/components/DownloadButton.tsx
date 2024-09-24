"use client";

import { useState } from "react";
import { Button } from "./ui/button"; // Ensure you have a Button component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Adjust the import path as necessary
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { docDefinition, formatToText } from "@/app/utils/helper";
import { ContentType } from "../utils/types";
import { useAppStore } from "../store";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type DownloadButtonProp = {
  contentType: ContentType;
};

const DownloadButton = ({ contentType }: DownloadButtonProp) => {
  const { analysis, coverLetter } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (format: "pdf" | "txt") => {
    const content =
      contentType === ContentType.analysis ? analysis : coverLetter?.content;
    if (!content) return;
    setIsDownloading(true);
    const fileName = `${contentType}_${Date.now()}.${format}`;

    try {
      if (format === "pdf") {
        const pdfDefinition = docDefinition(content);
        pdfMake.createPdf(pdfDefinition).download(fileName);
      } else if (format === "txt") {
        // Generate formatted text content
        const formattedText = formatToText(content);

        // Create a Blob object with the text content
        const blob = new Blob([formattedText], {
          type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="mr-2">
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => downloadFile("pdf")}
          className="hover:bg-background cursor-pointer"
        >
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => downloadFile("txt")}
          className="hover:bg-background cursor-pointer"
        >
          Download TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
