import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/Navbar"; // Ensure the correct import path
import DataLoader from "@/app/components/DataLoader";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intelligent AI",
  description: "AI-powered resume Tool for analysis and cover letter creation",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <DataLoader>{children}</DataLoader>
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
