// components/DocxPreview.tsx
import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { FileQuestion } from "lucide-react";
import Image from "next/image";

interface DocxPreviewProps {
  docBuffer: ArrayBuffer | null;
}

const DocxPreview = ({ docBuffer }: DocxPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const generatePreview = async () => {
      if (previewRef.current && docBuffer) {
        setIsLoading(true);
        // Render the docx file into the previewRef element
        await renderAsync(docBuffer, previewRef.current);

        previewRef.current.style.display = "block";
        const canvas = await html2canvas(previewRef.current, { useCORS: true });
        previewRef.current.style.display = "none";
        const imageUrl = canvas.toDataURL("image/png");

        setThumbnailUrl(imageUrl);

        setIsLoading(false);
      }
    };

    generatePreview();
  }, [docBuffer]);

  return (
    <div className="mt-6">
      <div ref={previewRef} style={{ display: "block", overflowY: "auto" }} />
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
