"use client";

import { useEffect } from "react";
import { useAppStore } from "../store";

export default function DataLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useAppStore((state) => state);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [setUser]);

  return <>{children}</>; // Render children inside client logic
}
