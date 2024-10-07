import Link from "next/link";
import { FileChartColumn } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background py-4 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <FileChartColumn className="h-6 w-6" />
          <span className="ml-2 font-semibold">Resume AI</span>
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end space-x-4">
          <Link
            href="https://functional-van-16a.notion.site/FAQ-10c989127eb280f0bf4aed662e2034e7"
            target="_blank"
            className="hover:underline text-sm mb-2 sm:mb-0"
          >
            FAQ
          </Link>
          <Link
            href="https://www.notion.so/Terms-of-Use-10c989127eb280a2bf97f0c972dacfc7"
            target="_blank"
            className="hover:underline text-sm mb-2 sm:mb-0"
          >
            Terms
          </Link>
          <Link
            href="https://functional-van-16a.notion.site/AI-Policy-10c989127eb2809eb29bc9c439af8c92"
            target="_blank"
            className="hover:underline text-sm mb-2 sm:mb-0"
          >
            AI Policy
          </Link>
          <Link
            href="https://functional-van-16a.notion.site/Privacy-Policy-10c989127eb280b29bfaddb67f66b15b"
            target="_blank"
            className="hover:underline text-sm mb-2 sm:mb-0"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
