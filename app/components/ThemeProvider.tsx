"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const backgroundClass =
    pathname === "/" ? "home-page-background" : "body-background";
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={backgroundClass}>{children}</div>
    </NextThemeProvider>
  );
};

export default ThemeProvider;
