import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/Navbar"; // Ensure the correct import path
import Footer from "@/app/components/Footer";
import ThemeProvider from "@/app/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Resume AI",
  description: "AI-powered resume Tool for analysis and cover letter creation",
  icons: {
    icon: "/favicon-32x32.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <>
            <Navbar />
            {children}
            <ToastContainer />
            <Footer />
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
