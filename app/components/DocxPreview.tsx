// components/DocxPreview.tsx
import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { FileQuestion } from "lucide-react";
import Image from "next/image";
import ShareResume from "./ShareResume";

interface DocxPreviewProps {
  docBuffer: ArrayBuffer | null;
  templateName: string;
}

const DocxPreview = ({ docBuffer, templateName }: DocxPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const generatePreview = async () => {
      if (previewRef.current && docBuffer) {
        setIsLoading(true);
        previewRef.current.style.position = "absolute";
        previewRef.current.style.top = "-9999px";
        previewRef.current.style.display = "block";
        // Render the docx file into the previewRef element
        await renderAsync(docBuffer, previewRef.current);

        const canvas = await html2canvas(previewRef.current, {
          useCORS: true,
          logging: false,
        });
        previewRef.current.style.position = "";
        previewRef.current.style.display = "none";

        const originalConsoleLog = console.log;
        console.log = function () {};
        const imageUrl = canvas.toDataURL("image/png");
        console.log = originalConsoleLog;

        setThumbnailUrl(imageUrl);

        setIsLoading(false);
      }
    };

    generatePreview();
  }, [docBuffer]);

  return (
    <div className="mt-6">
      {thumbnailUrl && (
        <ShareResume imageUrl={thumbnailUrl} templateName={templateName} />
      )}
      <div
        ref={previewRef}
        style={{ display: "block", position: "absolute", top: "-9999px" }}
      />
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt="Document Thumbnail"
          width={400}
          height={400}
        />
      ) : (
        <>
          {!isLoading ? (
            <div className="text-center text-muted-foreground">
              <FileQuestion className="mx-auto h-12 w-12 mb-2" />
              <p>No resume selected</p>
            </div>
          ) : (
            <p>Loading preview...</p>
          )}
        </>
      )}
    </div>
  );
};

export default DocxPreview;
