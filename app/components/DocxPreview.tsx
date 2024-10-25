// components/DocxPreview.tsx
import React, { useEffect, useState } from "react";
import { FileQuestion } from "lucide-react";
import ShareResume from "./ShareResume";
import { Document, Page, pdfjs } from "react-pdf";
interface DocxPreviewProps {
  pdfBlob: Blob | null;
  templateName: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

console.log(pdfjs.version);
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocxPreview = ({
  pdfBlob,
  templateName,
  isLoading,
  setIsLoading,
}: DocxPreviewProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePreview = async () => {
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setThumbnailUrl(url);
        console.log(url);
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [pdfBlob]);

  return (
    <div className="mt-6">
      {thumbnailUrl && (
        <ShareResume imageUrl={thumbnailUrl} templateName={templateName} />
      )}
      {thumbnailUrl ? (
        <>
          <Document
            file={thumbnailUrl}
            onLoadSuccess={() => console.log("successfully loaded preview")}
            loading="Loading PDF..."
          >
            <Page
              pageNumber={1} // Show only the first page
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </>
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
